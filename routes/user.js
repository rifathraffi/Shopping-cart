var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products = [
    {
      name:"Skyfall",
      category:"Action",
      description:"License to kill",
      image:"https://flxt.tmsimg.com/assets/p8919177_p_v13_bg.jpg"
    },
    {
      name:"Leon",
      category:"Crime",
      description:"Choose prof",
      image:"https://m.media-amazon.com/images/M/MV5BODllNWE0MmEtYjUwZi00ZjY3LThmNmQtZjZlMjI2YTZjYmQ0XkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_.jpg"
    },
    {
      name:"Up",
      category:"Animation",
      description:"Fly",
      image:"https://themify.me/demo/themes/post-type-builder/files/2015/05/up.jpg"
    },
    {
      name:"Big B",
      category:"Mass",
      description:"Bilal",
      image:"https://static.toiimg.com/photo/msid-61688826/61688826.jpg?95002"
    }
  ]

  res.render('index', {products,admin:false});
});

module.exports = router;
