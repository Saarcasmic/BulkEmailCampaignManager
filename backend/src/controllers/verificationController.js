const sgClient = require('@sendgrid/client');
const User = require('../models/User');

sgClient.setApiKey(process.env.SENDGRID_API_KEY);

exports.startVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // if (user.isSenderVerified) return res.status(400).json({ message: 'Sender is already verified.' });

    // TODO: The address details are required by SendGrid.
    // In a real application, you would collect this from the user during onboarding.
    const data = {
      nickname: user.name,
      from: { email: user.email, name: user.name },
      reply_to: { email: user.email, name: user.name },
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'US',
    };

    const request = {
      url: `/v3/senders`,
      method: 'POST',
      body: data,
    };

    const [response, body] = await sgClient.request(request);
    
    user.sendgridSenderId = body.id;
    await user.save();

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.', senderId: body.id });
  } catch (error) {
    console.error('SendGrid verification error:', error.response?.body);
    res.status(500).json({ message: 'Error starting verification process', error: error.response?.body?.errors });
  }
};

exports.checkVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.sendgridSenderId) {
      return res.status(404).json({ message: 'Sender ID not found for this user.' });
    }

    const request = {
      url: `/v3/senders/${user.sendgridSenderId}`,
      method: 'GET',
    };

    const [response, body] = await sgClient.request(request);
    
    if (body.verified) {
      user.isSenderVerified = true;
      await user.save();
    }

    res.status(200).json({
      isVerified: body.verified,
      status: body.verified ? 'Verified' : 'Not Verified',
    });
  } catch (error) {
    console.error('SendGrid status check error:', error.response?.body);
    res.status(500).json({ message: 'Error checking verification status', error: error.response?.body?.errors });
  }
}; 