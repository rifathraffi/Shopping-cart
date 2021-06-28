var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
/* GET users listing. */

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
  res.render('admin/view-products',{admin:true,products})
});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{ 
    console.log(req.body) 
    console.log(req.files.image)
    productHelper.addProduct(req.body,(id)=>{
      let image = req.files.image
      console.log(id)
      image.mv('./public/product-images/'+id+'.png',(err,done)=>{
        if(!err){
          res.render('admin/add-product')
        }else{
          console.log(err)
        }
      })
      
      
    })

})

module.exports = router;
