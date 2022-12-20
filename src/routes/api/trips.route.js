const router = require('express').Router();
const Trip = require('../../models/trip.model')

router.get('/', async (req,res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({error: 'Ha ocurrido un error.'})
  }
})

router.post('/', async(req,res) => {
  try {
    const newTrip = await Trip.create(req.body);
    res.status(201).json(newTrip)
  } catch (error) {
    res.status(500).json({error: 'Ha ocurrido un error.'})
  }
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const tripEdit = await Trip.findByIdAndUpdate(
      id,
      req.body,
      {new: true}
    );
    res.json(tripEdit);
  } catch (error) {
    res.status(500).json({error: 'Ha ocurrido un error.'})
  }
})

router.delete('/:id', async (req,res) => {
  const id = req.params.id

  try {
    const trip = await Trip.findByIdAndDelete(id)
    res.json(trip);
  } catch (error) {
    res.status(500).json({error: 'Ha ocurrido un error.'});
  }
  
})

module.exports = router;