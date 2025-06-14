import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Zap, Crown, Building } from 'lucide-react';

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started",
      icon: <Zap className="h-8 w-8" />,
      features: [
        "Up to 2,500 subscribers",
        "10,000 emails per month",
        "Basic templates",
        "Email support",
        "Basic analytics",
        "Drag & drop editor"
      ],
      color: "from-blue-500 to-blue-600",
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses",
      icon: <Crown className="h-8 w-8" />,
      features: [
        "Up to 10,000 subscribers",
        "50,000 emails per month",
        "Premium templates",
        "Priority support",
        "Advanced analytics",
        "A/B testing",
        "Automation workflows",
        "Custom domains"
      ],
      color: "from-purple-500 to-purple-600",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      icon: <Building className="h-8 w-8" />,
      features: [
        "Unlimited subscribers",
        "Unlimited emails",
        "Custom templates",
        "24/7 phone support",
        "Advanced reporting",
        "Multi-user accounts",
        "API access",
        "Custom integrations",
        "Dedicated account manager"
      ],
      color: "from-green-500 to-green-600",
      popular: false
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core features with no setup fees.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 relative ${
                plan.popular ? 'border-purple-200 bg-gradient-to-b from-purple-50/50 to-white' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`bg-gradient-to-r ${plan.color} text-white p-4 rounded-2xl mb-6 inline-block shadow-lg`}>
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              
              <button className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-8`}>
                Get Started
              </button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;