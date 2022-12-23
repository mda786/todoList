const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const _=require('lodash')
const port=3000
const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))
mongoose.connect('mongodb+srv://admin_Danish:DQOiLtEdUhIHpnhg@cluster0.qrdz5po.mongodb.net/todolistDB',{useNewUrlParser:true})
const listSchema=new mongoose.Schema({
    name:String
})
const List=mongoose.model('List',listSchema)

const listItem=new List({
    name:'Welcome to the toDoList'
})
const listItem1=new List({
    name:'you can add your todolist by on clicking + sign'
})
const listItem2=new List({
    name:'to delete plz checked on left side check box'
}) 

const listItems=[listItem,listItem1,listItem2]
app.get('/',(req,res)=>{
    List.find((err,lists)=>{
        if(lists.length===0){
            List.insertMany(listItems,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log('inserted successfully...');
                }
            })
            res.redirect('/')
        }
        else if(err){
            console.log(err);
        }
        else{
            res.render('list',{kindOfDay:'Today',listvalues:lists})
        }
    })
    
})
const listSchema1=new mongoose.Schema({
    name:String,
    items:[listSchema]
})
const List1=mongoose.model('List1',listSchema1)
app.get('/:customListName',(req,res)=>{
    const customListName=_.capitalize(req.params.customListName);
    List1.findOne({name:customListName},(err,lists1)=>{
        if(!err){
            if(!lists1){
                const list=new List1({
                    name:customListName,items:listItems
                })

                list.save()
                res.redirect('/'+customListName)
            }
            else{
                res.render('list',{kindOfDay:lists1.name,listvalues:lists1.items})
                
            }
        }
    })
    
    
    console.log(customListName);
})

app.post('/',(req,res)=>{
    value=req.body.inputName
    const listname=req.body.button
    const listItemn=new List({
        name:value
    })
    if(listname=='Today'){
        listItemn.save()
        res.redirect('/')
    }else{
        List1.findOne({name:listname},(err,foundlist)=>{
            foundlist.items.push(listItemn)
            foundlist.save()
            res.redirect('/'+listname)
        })
        
    }
})

app.post('/delete',(req,res)=>{
    const checks=req.body.checkbox;
    const hiddenName=req.body.hiddenName;
    if(hiddenName==='Today'){
        List.findByIdAndRemove(checks,(err)=>{
            if(err){
                console.log(err);
            }else{
            }
    
            res.redirect('/')
        })
    }
    else{
        List1.findOneAndUpdate({name:hiddenName},{$pull:{items:{_id:checks}}},(err)=>{
            if(!err){
                res.redirect('/'+hiddenName)
            }
        })
    }
    
})

app.listen(port,(req,res)=>{
    console.log(`server runs on ${port}`);
})