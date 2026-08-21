const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ==========================================
// PROPERTIES API ROUTES
// ==========================================
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM properties ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const data = req.body;
    const query = `
      INSERT INTO properties (
        id, title, type, category, categoryRaw, categoryLabel, purpose, price, 
        priceFormatted, location, district, address, size, bedrooms, bathrooms, 
        furnishing, status, availability, latitude, longitude, videoUrl, ownerName, 
        ownerPhone, listedBy, images, description, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(query, [
      data.id, data.title, data.type, data.category, data.categoryRaw, data.categoryLabel,
      data.purpose, data.price, data.priceFormatted, data.location, data.district,
      data.address, data.size, data.bedrooms || null, data.bathrooms || null,
      data.furnishing, data.status, data.availability, data.latitude, data.longitude,
      data.videoUrl, data.ownerName, data.ownerPhone, data.listedBy,
      JSON.stringify(data.images || []), data.description, JSON.stringify(data.features || [])
    ]);
    
    res.status(201).json({ message: 'Property created successfully', id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const query = `
      UPDATE properties SET 
        title=?, type=?, category=?, categoryRaw=?, categoryLabel=?, purpose=?, price=?, 
        priceFormatted=?, location=?, district=?, address=?, size=?, bedrooms=?, bathrooms=?, 
        furnishing=?, status=?, availability=?, latitude=?, longitude=?, videoUrl=?, ownerName=?, 
        ownerPhone=?, listedBy=?, images=?, description=?, features=?
      WHERE id=?
    `;
    await db.query(query, [
      data.title, data.type, data.category, data.categoryRaw, data.categoryLabel,
      data.purpose, data.price, data.priceFormatted, data.location, data.district,
      data.address, data.size, data.bedrooms || null, data.bathrooms || null,
      data.furnishing, data.status, data.availability, data.latitude, data.longitude,
      data.videoUrl, data.ownerName, data.ownerPhone, data.listedBy,
      JSON.stringify(data.images || []), data.description, JSON.stringify(data.features || []), id
    ]);
    res.json({ message: 'Property updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM properties WHERE id=?', [id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// ==========================================
// LEADS API ROUTES
// ==========================================
app.get('/api/leads', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM leads ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const data = req.body;
    const query = `
      INSERT INTO leads (id, name, phone, email, source, status, budget, requirement, location, timeline, assignedTo, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(query, [
      data.id, data.name, data.phone, data.email, data.source, data.status,
      data.budget, data.requirement, data.location, data.timeline, data.assignedTo, data.notes
    ]);
    res.status(201).json({ message: 'Lead created successfully', id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const query = `
      UPDATE leads SET 
        name=?, phone=?, email=?, source=?, status=?, budget=?, 
        requirement=?, location=?, timeline=?, assignedTo=?, notes=?
      WHERE id=?
    `;
    await db.query(query, [
      data.name, data.phone, data.email, data.source, data.status,
      data.budget, data.requirement, data.location, data.timeline, data.assignedTo, data.notes, id
    ]);
    res.json({ message: 'Lead updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM leads WHERE id=?', [id]);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, propertiesContext, leadsContext } = req.body;

    const systemPrompt = `You are an AI Operating Agent for Thanjai Property, a premium real estate CRM in Tamil Nadu.
    
Here is the current inventory of properties available in the CRM:
${JSON.stringify(propertiesContext)}

Here is the list of active leads in the CRM:
${JSON.stringify(leadsContext)}

Your task is to assist the real estate agent by answering their questions, searching for properties matching client needs, and providing CRM summaries based strictly on the provided context. Keep your responses concise, professional, and friendly. Use markdown formatting to highlight property names and prices.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process request with AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Thanjai Property AI Backend running on port ${PORT}`);
});
