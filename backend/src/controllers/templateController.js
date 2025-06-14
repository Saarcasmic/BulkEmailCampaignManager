const Template = require('../models/Template');

exports.listTemplates = async (req, res) => {
  const templates = await Template.find({}, '-owner').sort({ createdAt: -1 });
  res.json(templates);
};

exports.createTemplate = async (req, res) => {
  const { name, subject, content } = req.body;
  const template = new Template({ name, subject, content, owner: req.user.id });
  await template.save();
  res.status(201).json(template);
};

exports.updateTemplate = async (req, res) => {
  const { name, subject, content } = req.body;
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  if (String(template.owner) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  if (name) template.name = name;
  if (subject) template.subject = subject;
  if (content) template.content = content;
  await template.save();
  res.json(template);
};

exports.deleteTemplate = async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  if (String(template.owner) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await template.deleteOne();
  res.json({ message: 'Template deleted' });
}; 