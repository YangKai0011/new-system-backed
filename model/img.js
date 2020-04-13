var fs = require('fs'); 
module.exports ={
   
    readimg:function(path,res){
		fs.readFile(path,'binary',function(err,filedata){
			if(err){
				console.log(err);
				return;
			}else{
                res.write(filedata,'binary');
                console.log(filedata);
				res.end();
			}
		});
	}
}