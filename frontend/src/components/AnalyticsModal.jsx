import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Monitor,
  Smartphone,
  MapPin,
} from 'lucide-react';
import api from '../api';

// Sample mapping from geo name to ISO 2-letter code
const geoToCountryCode = {
  India: 'IN',
  'United States': 'US',
  Germany: 'DE',
  France: 'FR',
  Canada: 'CA',
  Unknown: '',
  // Add more mappings as needed
};

function getFlagEmoji(countryCode) {
  if (!countryCode) return '🏳️';
  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

const AnalyticsModal = ({ onClose, campaignId }) => {
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState({ devices: {}, geos: {} });

  useEffect(() => {
    if (campaignId) {
      api.get(`/campaigns`).then(res => {
        const found = res.data.find(c => c._id === campaignId);
        setCampaign(found);
        setAnalytics(found?.analytics || { devices: {}, geos: {} });
      });
    }
  }, [campaignId]);

  const totalDevices = Object.values(analytics.devices || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalGeos = Object.values(analytics.geos || {}).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign?.name}</h2>
            <p className="text-gray-600">Campaign Analytics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-10">
          {/* Devices */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Device Breakdown (Total: {totalDevices})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.devices || {}).map(([device, count]) => {
                const isDesktop = device.toLowerCase() === 'desktop';
                const Icon = isDesktop ? Monitor : Smartphone;

                return (
                  <div
                    key={device}
                    className="bg-blue-50 p-4 rounded-xl border border-blue-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <div className="text-sm text-gray-600">{device}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.devices || {}).length === 0 && (
                <div className="text-gray-500 col-span-full">No device data available</div>
              )}
            </div>
          </div>

          {/* Geos */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Geo Distribution (Total: {totalGeos})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.geos || {}).map(([geo, count]) => {
                const countryCode = geoToCountryCode[geo] || '';
                const flag = getFlagEmoji(countryCode);
                return (
                  <div
                    key={geo}
                    className="bg-green-50 p-4 rounded-xl border border-green-100"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                        <div className="text-sm text-gray-600">
                          {flag} {geo} {countryCode && `(${countryCode})`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.geos || {}).length === 0 && (
                <div className="text-gray-500 col-span-full">No geo data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsModal;
