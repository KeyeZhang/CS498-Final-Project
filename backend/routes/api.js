const mongoose = require('mongoose');
const Card = mongoose.model('card');
const User = mongoose.model('User');

module.exports = function(router, passport) {

    router.post('/register',
        passport.authenticate('local-signup'),
        function(req, res) {
            res.status(200).json({ user: req.user.email
        });
    });

    router.post('/login',
        passport.authenticate('local-login'
        ),
        function(req, res) {
            console.log(req.isAuthenticated());
            res.status(200).json({ user: req.user.email
        });
    });

    //here we are going to qury back all the users' data including username, email, all his cards
    router.get('/profile',
        //isLoggedIn,
        function(req, res) {
            console.log(req.isAuthenticated());
            //add more query based on req.user.id
            // res.status(200).json({ user: req.user, message: "Welcome!"});
            res.send(req.user);
    });


    router.get('/logout', function(req, res) {
        req.logOut();
        res.redirect('/');
        res.status(200).json({ message: "logged out "});
    });

    router.get('/cards', isLoggedIn, (req, res) => {
        Card.find({ userId: req.user.id })
          .then ( (cards) =>{
            res.send(cards);
          }
          )
    });

    router.get('/collections',function(req, res){
    Card.find(function(err, collections){
                    if(err){
                        return res.status(500).json({message:"Server error", data:[]});
                    }
                    // if (collections == null || collections.length == 0) {
                    //     res.status(404).json({message:'Empty', data:{}});
                    // }
                    res.status(200).json({message:'OK!', data:collections});
                });
  });

    router.post('/cards', isLoggedIn, (req, res) => {

      console.log(req.body);
      const {card_name, city_name, Latitude, Longitude, day, money, picture, post_txt } = req.body;

      const card = new Card({
        card_name,
        city_name,
        Latitude,
        Longitude,
        day,
        money,
        picture,
        post_txt,
        userId: req.user.id
      });

      card.save()
        .then ( () =>{
          req.user.save()
            .then( (user) => {
              res.send(user);
            }
            )
        }
      )
  });


    router.get('/followings', isLoggedIn, (req, res) => {
        const followingsId = req.user.followings;

        User.find({ _id : { "$in": followingsId }})
          .then ( (users) =>{
            res.send(users);
          }
        )
    });


    router.get('/followers', isLoggedIn, (req, res) => {
        const followersId = req.user.followers;

        User.find({ _id : { "$in": followersId }})
          .then ( (users) =>{
            res.send(users);
          }
        )
    });


    router.post('/deletecards', (req, res) => {
      const { cardId } = req.body;

      Card.remove({_id: cardId}).then(
        Card.find({ userId: req.user.id })
          .then ( (cards) =>{
            res.send(cards);
          }
        )
      )
  });

  router.post('/updateuser', (req, res) => {
    const { description, email, headpicture } = req.body;

    User.findByIdAndUpdate(req.user.id, {$set:req.body})
    .then((user) =>{
      res.send(user);
    });
  });


  router.post('followuser', (req, res) => {
    const { followeeId } = req.body;

    //two way binding, the first direction
    User.findOne({"_id": followeeId })
    .then((user) => {
      user.followers.push(req.user.id);
      user.save().then(() => {

        //two way binding, another direction
        User.findOne({"_id": req.user.id}).then((user) => {
          user.followings.push(followeeId);
          user.save().then((user) => {
            res.send(user);
          });
        });


      })
    });
  });


  router.post('unfollowuser', (req, res) => {
    const { unfolloweeId } = req.body;

    User.findByIdAndUpdate(unfolloweeId, { $pullAll: { followers: req.user.id } } )
    .then((user) => {
      //do nothing with that returned user
      //the another direction
      User.findByIdAndUpdate(req.user.id, { $pullAll: { followings: unfolloweeId  } } )
      .then((user) => {
        res.send(user);
      });

    });

  });


    return router;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "unable to auth" });
}
