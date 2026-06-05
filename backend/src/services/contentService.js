// Content service seeds and reads MongoDB impact stories for the public website.
import { ImpactStory } from '../models/ImpactStory.js';

const seedStories = [
  {
    title: 'Water-smart citrus expansion',
    region: 'Mpumalanga',
    metric: '31% lower water draw',
    summary: 'Sensor-led irrigation scheduling reduced abstraction while protecting export-grade fruit consistency.',
    category: 'Water stewardship'
  },
  {
    title: 'Regenerative maize rotation',
    region: 'KwaZulu-Natal',
    metric: '18% soil carbon lift',
    summary: 'Legume rotations and residue retention improved soil structure across commercial maize blocks.',
    category: 'Soil health'
  },
  {
    title: 'Greenhouse yield command',
    region: 'Western Cape',
    metric: '2.7x yield density',
    summary: 'Controlled climate production increased tonnage per hectare and stabilized supply contracts.',
    category: 'Controlled environment'
  }
];

export async function getImpactStories() {
  const count = await ImpactStory.estimatedDocumentCount();

  if (count === 0) {
    await ImpactStory.insertMany(seedStories);
  }

  return ImpactStory.find().sort({ createdAt: -1 }).lean();
}
