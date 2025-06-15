import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MousePointer, Users, TrendingUp, BarChart3, MousePointer2 } from 'lucide-react';
import api from '../api';

const MetricsModal = ({ onClose, campaignId }) => {
  const [campaign, setCampaign] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (campaignId) {
      api.get(`/campaigns`).then(res => {
        const found = res.data.find(c => c._id === campaignId);
        setCampaign(found);
        setMetrics(found?.metrics || { sent: 0, delivered: 0, opened: 0, clicked: 0 });
      });
    } 
  }, [campaignId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign?.name}</h2>
            <p className="text-gray-600">Campaign Metrics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3">
                <Mail className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics?.sent ? metrics.sent.toLocaleString() : 0}</div>
                  <div className="text-sm text-gray-600">Emails Sent</div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics?.delivered ? metrics.delivered : 0}</div>
                  <div className="text-sm text-gray-600">Delivered</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center space-x-3">
                <MousePointer className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics?.opened ? metrics.opened : 0}</div>
                    <div className="text-sm text-gray-600">Opened</div>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-3">
                <MousePointer2 className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                        {metrics?.clicked ? metrics.clicked : 0}
                  </div>
                  <div className="text-sm text-gray-600">Clicked</div>
                </div>
              </div>
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

export default MetricsModal;