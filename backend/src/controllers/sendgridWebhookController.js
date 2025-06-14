const Campaign = require('../models/Campaign');

function parseDevice(useragent) {
  if (!useragent) return 'Unknown';
  if (/mobile/i.test(useragent)) return 'Mobile';
  if (/tablet/i.test(useragent)) return 'Tablet';
  if (/windows|macintosh|linux/i.test(useragent)) return 'Desktop';
  return 'Other';
}

module.exports = async (req, res) => {
  try {
    const events = req.body;
    const io = req.app.locals.io;
    console.log('Received SendGrid webhook:', JSON.stringify(events, null, 2));
    for (const event of events) {
      // Support both root and custom_args campaignId
      const campaignId = event.campaignId || event?.custom_args?.campaignId;
      if (!campaignId) continue;
      const update = {};
      // Helper: filter out non-genuine opens
      const isGenuineOpen = () => {
        if (event.event !== 'open') return false;
        if (event.sg_machine_open === true) return false; // Apple MPP machine open
        const ua = (event.useragent || '').toLowerCase();
        // Add more known bot/prefetcher UAs as needed
        if (ua.includes('googleimageproxy') || ua.includes('cloudmark') || ua.includes('symantec') || ua.includes('spam') || ua.includes('filter')) return false;
        return true;
      };
      if (event.event === 'delivered') update['metrics.delivered'] = 1;
      if (event.event === 'open' && isGenuineOpen()) update['metrics.opened'] = 1;
      if (event.event === 'click') update['metrics.clicked'] = 1;
      // Analytics for open/click
      if (['open', 'click'].includes(event.event)) {
        const device = parseDevice(event.useragent);
        const geo = event.geoip?.country || 'Unknown';
        update[`analytics.devices.${device}`] = 1;
        update[`analytics.geos.${geo}`] = 1;
      }
      if (Object.keys(update).length > 0) {
        await Campaign.updateOne(
          { _id: campaignId },
          { $inc: update }
        );
        // Emit real-time update to campaign room
        const campaign = await Campaign.findById(campaignId);
        if (campaign && io) {
          io.to(`campaign_${campaignId}`).emit('campaignUpdate', {
            _id: campaign._id,
            metrics: campaign.metrics,
            analytics: {
              devices: campaign.analytics.devices ? Object.fromEntries(campaign.analytics.devices) : {},
              geos: campaign.analytics.geos ? Object.fromEntries(campaign.analytics.geos) : {},
            },
            status: campaign.status,
            recipients: campaign.recipients,
          });
        }
      }
    }
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).json({ message: 'Webhook error', error: err.message });
  }
}; 