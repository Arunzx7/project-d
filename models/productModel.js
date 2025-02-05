const mongoose =  require('mongoose')

const productSchema = new mongoose.Schema({
    product_title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
     },
     categoryId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Category',
         require:true
     },
     brandId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Brand',
         require:true
     },
    images:[
        {
            type:String,
            require:true
        }
    ]
    ,
    isPublish:{
        type:Boolean,
        default:true,
        require:true
    },
    stock:{
        type:Number,
        require:true
    }
})

module.exports = mongoose.model('productModel',productSchema)