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
	},
	readExcel:(path,res)=>{
		fs.readFile(path, (err, data) => {
			if (err) {
			  res.send(err);
			} else{
			  res.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
			  //设置下载文件名,中文文件名可以通过编码转换写入headr中
			  res.set("Content-Disposition", "attachment; filename=" + encodeURI('学生信息登记表') + ".xlsx");
			  res.end(data, 'binary');
			}
		});
	},
	readWord:(path, res)=>{
		fs.readFile(path, (err, data) => {
			if (err) {
			  res.send(err);
			} else {
			  res.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
			  //设置下载文件名,中文文件名可以通过编码转换写入headr中
			  res.set("Content-Disposition", "attachment; filename=" + encodeURI('调宿信息登记表') + ".docx");
			  res.end(data, 'binary');
			}
		  });
	}
};