var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const { getTotalAmount, getCartCount } = require('../helpers/user-helper');
var userHelper = require('../helpers/user-helper')

const verifyLogin=(req,res,next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function(req, res, next) {
  let user = req.session.user
  let cartCount = null
  if(req.session.user){
  cartCount = await userHelper.getCartCount(req.session.user._id)}
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { admin: false, products,user,cartCount})
    })

  
});

router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
  res.render('user/login',{loginErr:req.session.userLoginErr})
  req.session.userLoginErr=null  
}

})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    //console.log(response)
    
    req.session.user = response
    req.session.user.loggedIn = true
    req.session.userLoggedIn=true
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      
      req.session.user=response.user
      req.session.user.loggedIn=true
      req.session.userLoggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr = "Invalid username or password"
      res.redirect('/login')
    }
  })

})

router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.userLoggedIn=false
  res.redirect('/login')
})

router.get('/cart',verifyLogin,async(req,res)=>{
  console.log("CArt Called******************************")
  let products = await userHelper.getCartProducts(req.session.user._id)
  let totalValue = await userHelper.getTotalAmount(req.session.user._id)
  //console.log("***********"+totalValue.total)
  res.render('user/cart',{user:req.session.user._id,products,totalValue})
  
})
router.get('/add-to-cart/:id',(req,res)=>{
  //console.log("api call");
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
}
)
router.post('/change-product-quantity',(req,res,next)=>{
  userHelper.changeProductQuantity(req.body).then(async(response)=>{
    let count = await getCartCount(req.body.user)
    console.log("********"+count+"*****")
    if(count){
    response.total = await userHelper.getTotalAmount(req.body.user)}else{
      response.total=null
    } 
    res.json(response)
  })
})
router.get('/place-order',verifyLogin,async(req,res)=>{
  let total = await userHelper.getTotalAmount(req.session.user._id)
  //console.log("+++"+total)
  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/remove-cart-product',verifyLogin,(req,res,next)=>{
  userHelper.removeCartProduct(req.body).then((response)=>{
    res.json(response)
  })
})
router.post('/place-order',async(req,res)=>{
  //console.log(req.body)
  let products = await userHelper.getCartProductsList(req.body.userId)
  let totalPrice = await userHelper.getTotalAmount(req.body.userId)
  //console.log("**+*+**"+totalPrice)
  userHelper.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelper.generateRazorpay(orderId,totalPrice).then((response)=>{
        res.json(response)
      })
    }
    
  })
})
router.get('/order-success',(req,res)=>{
  res.render('user/order-success',{user:req.session.user})
})
router.get('/order-history',async(req,res)=>{
  let orderDetails = await userHelper.getOrderHistory(req.session.user._id)
  res.render('user/order-history',{user:req.session.user,orderDetails})
})
router.get('/view-order-products/:id',async(req,res)=>{
  let orderProducts = await userHelper.getOrderProducts(req.params.id)
  //console.log("*****"+orderProducts)
  res.render('user/view-order-products',{user:req.session.user,orderProducts})
})

router.post('/verify-payment',(req,res)=>{
  //console.log(req.body)
  userHelper.verifyPayment(req.body).then(()=>{
    userHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    res.json({status:false})
  })
})



module.exports = router;
