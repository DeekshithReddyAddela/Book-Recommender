var table;
var rat,userid,rating,ibn;
var t,t2;
var lookusers={};
var tz={};
var tz2={};
var result;
var resultDiv=[];
var newUser={};
var recommendations={};
var fin;
var movimgs={};



function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable("BX-Book-Ratings.csv", "header");
   table1 = loadTable("BX-Books.csv", "header");
   table2=loadTable("use.csv", "header");
  //the file can be remote
  t=loadTable("ratings.csv","csv","header");
   t2=loadTable("books.csv","csv","header"); 
   
   
}

function setup() {
	noCanvas();
	// img = createImg("http://th07.deviantart.net/fs70/PRE/i/2011/260/3/5/dash_hooray_by_rainbowcrab-d49xk0d.png");
  // img.class("featurette-image img-responsive center-block");
  // img.parent('#teste');
 
  
  // img1=createImg("b2.jpg");
   // img1.class("featurette-image img-responsive center-block");
  // img1.parent("#teste"+2);
  
  // img5=createImg("b2.jpg");
   // img5.class("featurette-image img-responsive center-block");
  // img5.parent("#teste"+5);
	var dropdowns=[];
	userid=t.getColumn("Userid");
	
	
	for(var i=0;i<userid.length;i++){
	
	
	lookusers[userid[i]]=t.getRow(i);
	
}
	
	var titles=t2.getColumn("bookname");
	// console.log(titles);
	var titlesimg=t2.getColumn("imge"); 
	for(var i=0;i<titles.length;i++)
		movimgs[titles[i]]=titlesimg[i]+","+t2.getRow(i).arr[3]+","+t2.getRow(i).arr[4]+","+t2.getRow(i).arr[5];
	for(var i=0;i<titles.length;i++){
		
		var dive=createImg(titlesimg[i]+","+t2.getRow(i).arr[3]+","+t2.getRow(i).arr[4]+","+t2.getRow(i).arr[5]);
		var div=createDiv(titles[i]);
		var comp=createP('');
		dive.class("img-rectangle");
		
		dive.style('height','200px');
		dive.style('width','140px');
		div.style('padding','8px 16px');
	div.style('display','block');
	div.style('backgroundColor','#FFFFFF');
	div.style('font-size:15px');
	dive.parent(comp);
	div.parent(comp);
	
	comp.class("col-lg-4");
    comp.parent("#interface"+6);
	
		var dropdown=createSelect('');
		dropdown.title=titles[i];
		dropdown.parent(div);
		dropdowns.push(dropdown);
		for(var star=0;star<6;star++){
			dropdown.option(star);
		}
	}
	
	
	

resultDiv=[];






var button=createButton('submit');
button.parent("#inter");
  button.style('margin','4px 40px');
  button.style('padding','8px 16px');
  button.style('display','block');
  button.style('color','#ffffff');
button.mousePressed(predict);
result =createP('');

function predict(){
	
	fin={};
		finm={};
		movies={};
		recommendations={};
	
	
	for(var i=0;i<dropdowns.length;i++){
		var title=dropdowns[i].title;
		var rating=dropdowns[i].value();
		if(rating=='0')
			rating=null;
		newUser[i+1]=rating;
	}
	 console.log(newUser);
	//new user values created
	
	findNear(newUser);
}

function findNear(user){
	for(var i=0;i<resultDiv.length;i++){
		resultDiv[i].remove();
	}
	

var similarityScores={};
for(var i=0;i<t.getColumn(0).length;i++){
	var other=t.getColumn(0)[i];
	
		
		var similarity=euclidDist(user,other);
		similarityScores[other]=similarity;
	
	
}
var usdata=t.getColumn(0);
console.log(similarityScores);
 //console.log(usdata);
usdata.sort(compareSimilarity);
 console.log(usdata);
function compareSimilarity(a,b){
	var score1=similarityScores[a];
	var score2=similarityScores[b];
	return score2-score1;
	console.log(score1,score2);
	
	
	
}
var tit=t2.getColumn("bookname");

for(var i=0;i<tit.length;i++){
	var tite=tit[i];
	// console.log(tite);
	// console.log(user);
	//console.log(user[tite]);
	
	if(user[i+1]==null)
	{
				
	// }
	// var weightedSum=0;
	// var simlaritySum=0;
	
	recommendations[tite] = {
              total: 0,
              simSum: 0,
              ranking: 0
            }
	 var k=86;
// console.log(similarityScores);
 for(var j=0;j<k;j++){
		var sim=similarityScores[usdata[j]];
		//var div=createDiv(usdata[i]+':'+score);
		
		var ratings=lookusers[usdata[j]];
		
		
		var ratings1=tz2.getString(i+1,1);
		
		if(ratings1!="null"){
			
		var rating=parseInt(ratings1);
		
		recommendations[tite].total+=rating*sim;
		recommendations[tite].simSum+=sim;
		
		//console.log(recommendations[tite].total +"    " +rating+" "+sim+"     "+usdata[j]+"     "+recommendations[tite].simsum);
		}
		
	 }
	 
	 //var stars=nf(recommendations[tite].total/recommendations[tite].simSum,1,2);
	 // var div=createDiv(tite+':' +stars);
        // resultDiv.push(div);
        // div.parent(result);

	
	
}
	}
// console.log(usdata);
 // var k=5;
// console.log(similarityScores);
 // for(var i=0;i<k;i++){
		// var score=nf(similarityScores[usdata[i]],1,2);
		// var div=createDiv(usdata[i]+':'+score);
		// resultDiv.push(div);
		// result.parent(div);
		
	 // }
	// Ok, now we can calculate the estimated star rating for each movie
	
  var movies = Object.keys(recommendations);
  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i];
    // Total score divided by total similarity score
    recommendations[movie].ranking = recommendations[movie].total / recommendations[movie].simSum;
	
	if(recommendations[movie].simSum!=0)
		fin[movie]=recommendations[movie].ranking;
  }
  var finm=Object.keys(fin);
  // console.log(finm);
  

// Sore movies by ranking
  movies.sort(byRanking);
  finm.sort(byRanking);
  // console.log(finm);
  
  function byRanking(a, b) {
	  // if((recommendations[a].ranking<=5)&&(recommendations[a].ranking>=1)&&(recommendations[b].ranking>=1)&&(recommendations[b].ranking<=5))
	  // console.log(recommendations[b].ranking - recommendations[a].ranking);
    return recommendations[b].ranking - recommendations[a].ranking;
  }
  
  
// Display everything in sorted order
  for (var i = 0; i < finm.length; i++) {
    var movie = finm[i];
    var stars = fin[movie];
	 var div=createDiv(movie+' ' + nf(stars,1,1) + '⭐');
     var dive=createImg(movimgs[movie]);
	 dive.class("img-rectangle");
		dive.style('height','200px');
		dive.style('width','140px');
		var comp=createP('');
		
		div.style('padding','8px 16px');
	div.style('display','block');
	div.style('backgroundColor','#FFFFFF');
	dive.parent(comp);
	div.parent(comp);
	resultDiv.push(comp);
	comp.class("col-lg-4");
    comp.parent("#interface"+7);
		// resultDiv.push(comp);
		// resultDiv.push(dive);
		// result.parent(comp);
		// result.parent(dive);
		
		
	
   // var rec = createP(movie + ' ' + nf(stars,1,1) + '⭐');
    //rec.parent('#results');
  }  
	 
	 
	 
	 
	 
	 
	 
}





}

function euclidDist(tz,person2){
	




tz2=lookusers[person2];
var sumSquares=0;

for(var j=1;j<t.getRow(0).arr.length;j++){
var t3=tz[j];
var t4=tz2.getString(j,1);


if((t3!=null)&&(t4!="null"))
{
	

var r1=parseInt(t3);
	var r2=parseInt(t4);
	var diff=r1-r2;
	sumSquares+=diff*diff;
}



}

var d=sqrt(sumSquares);
var similarity=1/(1+d);
return similarity;

}