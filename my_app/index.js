//application requirements
const Joi = require('joi');
const express = require('express');
const app = express();

//Adding a piece of middleware
app.use(express.json());

//array used as database for reviews
const review = [
   { reviewid: 1, rating: 3, name: 'pogo stick', from_date: 01172002, to_date: 05262004}, 
   { reviewid: 2, rating: 1, name: 'football', from_date: 11162007, to_date: 12062007}, 
   { reviewid: 3, rating: 4, name: 'iPhone' , from_date: 01012002, to_date: 03042005},
];

//return all reviews
app.get('/review', (req, res) => {
    res.send(review);
});

//return a single review to view
app.get('/review/:reviewid', (req, res) => {
    
    //returns a single review based of reviewid index
    const reviews = review.find(c => c.reviewid === parseInt(req.params.reviewid));
    
    //error handling if not found
    if (!reviews) return res.status(404).send("the review id was not found");
    
    //send to client
    res.send(reviews);
});

//return the number of stars for a specific review
app.get('/review/:n/:rating', (req, res) => {
    //search for review id
    while(review.length < review.length + 1){
        const reviews = review.find(c => c.rating === parseInt(req.params.rating));
        if (!reviews) return res.status(404).send("no item(s) has this rating");
    
        res.send(reviews); 
        review++;
    }
});

//STILL WORKING ON THE FUNCTIONALITY OF THIS ONE
//return a number of reviews and their dates
app.get('/review/:reviewid/:from_date/:to_date', (req, res) => {
    const reviews = review.find(c => c.from_date === parseInt(req.params.from_date));
    if (reviews<review.from_date)
    {
        
    }
    if (!reviews) return res.status(404).send("the review id was not found");
});
//------------------------------------------------------------------------------------



//create a new review
app.post('/review', (req, res) => {
    
    //error validation
    const { error } = validateReview(req.body); //equivelant to result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    //setting the reviewid of new review to the next record in the array
    const revs = {
        reviewid: review.length + 1, 
        rating: 2, 
        name: req.body.name
    };
    
    //set the new record and send to client
    review.push(revs);
    res.send(revs);
});

//update a new review
app.put('/review/:reviewid', (req, res) => {
    
    //searches the reviews based of reviewid index
    const reviews = review.find(c => c.reviewid === parseInt(req.params.reviewid));
    if (!reviews) return res.status(404).send("the review id was not found");
    
    //error validation
    const { error } = validateReview(req.body); //equivelant to result.error
    
    //return error status
    if(error) return res.status(400).send(error.details[0].message);
    
    //update the record and send to client   
    reviews.name = req.body.name;
    res.send(reviews);
});


//delete a review
app.delete('/review/:reviewid', (req, res) => {
   
   //searches the reviews based of reviewid index
   const reviews = review.find(c => c.reviewid === parseInt(req.params.reviewid));
    if (!reviews) return res.status(404).send("the review id was not found");
    
    //sets index variable to the reviewid and deletes 1 item at this index
    const index = review.indexOf(reviews);
    review.splice(index, 1);
    
    //sends to client
    res.send(reviews);
});


//function used to validate reviews
function validateReview(reviews){
    
    //schema for Joi class validation
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    //return validation
    return Joi.validate(reviews, schema);
}

//listening port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));