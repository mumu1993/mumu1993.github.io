var imageLoaded = false;
var dataIsOk = false;
var flagBall = true,
	textTimer;
// 定义保存文字数组
var roomText = ["肚子好饿!", "快去找点吃的！", "家里没有吃的了", "怎么办？", "听说附近有厨艺很棒", "野生男神出没", "快去捕捉！", "去客厅", "到客厅里捕捉男神"];
var livingText = ["嗅到了男神的味道!","仔细寻找!","这里有三个男神",
	"都扑捉成功","才有机会抽奖", "你距离男神不到十步","请注意,男神出没","请准备好柔光球！","再移动一步","就可以看见男神哦~",
	"加油，你距离男神","就剩下一个转身！", "左右查看","男神距离你很近了",
	"前方十步内","有国产长腿欧巴出现","前方男神出没","赶紧抓回来！",
	"出现男神！", "快去捕捉！", "点击图鉴", "鉴别男神属性",
	"点击柔光球", "捕捉男神！", ];
var winCatch = ["捕捉成功！！", "据说捕捉男神越多", "就有机会获得", "vivo X7手机", "捕捉男神过程", "即是抽奖过程"];
var failCatch = ["姐姐好饿", "快给我补充元气", "继续战斗", "手残没耐性的孩子", "还是洗洗睡吧", "你没看大神的攻略", "是没办法通关的"];
var toStreet = ["外面街道出现男神！", "快去捕捉！"];
var toCaffee = ["咖啡馆出现男神！", "快去捕捉！"];
function starShow(){
	if( imageLoaded && dataIsOk ){
		init();
		setTimeout( function(){
			$(".page-280").hide();
			$(".page-294").hide();
			$(".page-292").hide();
			$(".page-293").hide();
			$(".page-305").show();
		// setTimeout(function () {
		// 	$(".page-298").hide();
		// },3000)
			$(".page-257").show();
			$(".page-281").show();
			$(".page-279").show();
			$(".page-275").show();
		}, 500 );
		
		

		var location = window.location.pathname;
		if (location.indexOf("bedroom")>0){
			showText(roomText);
		}else {
			showText(livingText)
		}
		if( navigator.userAgent.indexOf('iPhone') <= -1 && roomID == 'bedroom'){
			$('<div class="moveNotice"></div>').appendTo(page);
			setTimeout( function(){
				$('.moveNotice').remove();
			} , 3000 );
		}
	}
}
function showText(argument) {
	clearInterval(textTimer);
	var i = 0;
	$(".text-container").html(argument[0]);
	var textTimer = setInterval(function() {
		if (i > argument.length) {
			i = 0;
		}
		$(".text-container").html(argument[i]);
		i++;
	}, 2000);

};
//$.each($('.page-257'), function(index, page) {
	$('.page-268').on('touchstart','.poster' ,function(event) {
		return false;
	});
	var page,imagePre,roomID;
	if (window.location.pathname.indexOf('bedroom') > 0){
		page = $('.page-281').get(0);
		imagePre = './img/bedroom/';
		roomID = 'bedroom';
	}else if(window.location.pathname.indexOf('coffee') > 0){
		page = $('.page-257').get(0);
		imagePre = './img/coffee/';
		roomID = 'coffee';
	}else if(window.location.pathname.indexOf('livingroom') > 0){
		page = $('.page-275').get(0);
		imagePre = './img/livingroom/';
		roomID = 'livingroom';
	}else if(window.location.pathname.indexOf('street') > 0){
		page = $('.page-279').get(0);
		imagePre = './img/street/';
		roomID = 'street';
	}
	$(page).removeClass('animated');
	//end
	function changeText(){
		wxFriendData.desc = shareFriendEnd;
		wxTimelineData.title = shareTimelineEnd;
	}
	function putb64(imgdata , token , callback ){
		var pic = imgdata.split(',')[1];
		var url = "http://up.qiniu.com/putb64/-1"; 
		var xhr = new XMLHttpRequest();
		var obj;
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4){
				console.log( xhr.responseText );
				 obj = JSON.parse(xhr.responseText);
				 console.log( obj );
				 var url = 'http://tofax-salesman-cdn.izhida.cn/'+obj.key;
				 callback(url);
			}
		}
	 	console.log(token);
		xhr.open("POST", url, true); 
		xhr.setRequestHeader("Content-Type", "application/octet-stream"); 
		xhr.setRequestHeader("Authorization", "UpToken "+token); 
		xhr.send(pic);
	}
	function init(){
		$(".details-light").click(function(event) {
			$(page).removeClass('animated');
			for (var i = 0;i<catchs.length;i++){
				$(".head").eq(9-catchs[i]).css({
					"z-index" : "100"
				});
			}
			var a =catchs.length;
			$(".details").hide();
			$(".details").eq(9-(catchs[a-1])).show();
			$(".page-262").show();
			$(".page-284").show();
		});
		function prize() {
			$('<input type="text" id="name" class="input"/>').appendTo('.name-input');
			$('<input type="text" id="phone" class="input"/>').appendTo('.phone-input');
			$(".submit").click(function(argument) {
				var name = $("#name").val();
				var phone = $("#phone").val();
				if (name == ""){
					alert("请填写姓名!");
					return;
				}else if ( (/^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/).test(phone) == false){
					alert("请填写正确的手机号码!");
				}else if (name !== "" && (/^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/).test(phone) == true){
					var data = {};
					data.name = name;
					data.phone = phone;
					var _this = this;
					$.post( submitUrl , data , function(res){
						if( res == 1 ){
							$('.page').hide();
							//$('.page-257').show();
							if( !isIos ){
								controls.enabled = true;
								//controls.enablControl();
							}
							showUploadPage(1);
						}else{
							alert(res);
						}
					} );
				}

			});
		}
		prize();
		var controlsLock = false;
		var uploadPageShowed = false;
		function showUploadPage(reward){
			if( uploadPageShowed ){
				return;
			}
			uploadPageShowed = true;
			if( controls ){
				controls.enabled = false;
			}
			changeText();
			if( roomID != 'coffee' ){
				window.location.href = '/coffee.php';
				return; 
			}
			$('.page-265').show();
			if( !reward ){
				$('.page-312').show();
				setTimeout( function(){
					$('.page-312').fadeOut('slow');
				} , 2000 );
			}
			var showed = false;
			$('.page-265').find('.invite').on('click', function(event) {
				if( showed ){
					return;
				}
				showed = true;
				$(this).closest('.page').hide();
				showUploadRealPage();
			});
			function showUploadRealPage(){
				$('.page').hide();
				$('.page-263').show();
				$('.confirm').css('z-index',99).hide();
				$('.camera').html( '<input type="file" accept="image/*" capture="camera" id="upload" style="width:100%;height:100%;opacity:0;position:absolute;top:0" />' );
				var imgInfo = {};
				var img;
				var maskImg = new Image();
				maskImg.src = '/img/maskImg.png';
				

				$('.page-263').children(':first').after( '<canvas id="uploadShow" style="width:32rem;height:52.05rem;position:absolute;top:0;left:0" ></canvas>' );
				var canvas = $('#uploadShow').get(0);
				canvas.width = 640;
				canvas.height = 1041;
				var context = canvas.getContext('2d');
				$('.upload-pic-action').remove();
				$('<div class="upload-pic-action"></div>').appendTo( '.page-263' );
				$('.upload-pic-action').css( {width:'12rem',height:'12rem',position:'absolute',top:'16.4rem',left:'16.1rem'} );
				var uploadLock = false;
				$('.confirm').on('click', function(event) {
					event.preventDefault();
					if(navigator.userAgent.indexOf('iPhone') <= -1  ){
						if( uploadLock ){
							return;
						}
						$('<div class="uploadTip">图片上传中....</div>').appendTo('body');
						uploadLock = true;
						$.get(getTokenUrl, function(data) {
							var token = data.uptoken;
							putb64(  canvas.toDataURL( 'image/jpg',0.2 ) , token , function(url){
								var uploadImg = new Image();
								uploadImg.onload = function(){
									$('.uploadTip').remove();
									$('.page-268').find('.poster').html('<img style="width:100%;height:100%" src="'+url+'" alt="" />');
									$('.page').hide();
									$('.page-268').show();
									$('.page').not('.page-268,.page-269').remove();
								}
								uploadImg.src = url;
							} )
						},'json');
					}else{
						$('.page-268').find('.poster').html('<img style="width:100%;height:100%" src="'+canvas.toDataURL( 'image/jpg')+'" alt="" />');
						$(this).closest('.page').hide();
						$('.page-268').show();
						$('.page').not('.page-268,.page-269').remove();
						controls.disconnect();
					}
					
				});
				//$('#uploadShow').css( {'width':'100%',height:'100%' } );
				

				var mc = new Hammer( $('.upload-pic-action').get(0) );
			    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
			    mc.get('pinch').set({ enable: true });
			    mc.get('rotate').set({ enable: true });

			    var oldpoz = {};
			    mc.on('panstart panmove panend', function(event) {
			        if( event.type == 'panstart' || event.type == 'panend' ){
			            oldpoz.x = 0;
			            oldpoz.y = 0;
			        }else{
			            var movedX = (event.deltaX - oldpoz.x);
			            var movedY = (event.deltaY - oldpoz.y);
			            oldpoz.x = event.deltaX;
			            oldpoz.y = event.deltaY;
			            //console.log("movedX:"+movedX+' movedY:'+movedY+'event.deltaX:'+event.deltaX+' event.deltaY:'+event.deltaY+"\r\n");
			            imgInfo.x += movedX;
			            imgInfo.y += movedY;
			            drawImage();
			        }
			    });
			    var oldScale = 1;
			    mc.on('pinchstart pinchmove pinchend', function(event) {
			        if( event.type == 'pinchstart' || event.type == 'pinchend' ){
			            oldScale = 1;
			        }else{
			            var nowScale = event.scale/oldScale;
			            oldScale = event.scale;
			            imgInfo.scale *= nowScale;
			            drawImage();
			        }
			    });
			    var oldRotation = 0;
			    mc.on('rotatestart rotatemove rotateend', function(event){
			        if( event.type == 'rotatestart' || event.type == 'rotateend' ){
			            oldRotation = 0;
			        }else{
			            nowRotation = event.rotation - oldRotation;
			            oldRotation = event.rotation;
			            imgInfo.rotation += nowRotation;
			            drawImage();
			        }
			    });

				function drawImage(){
			        context.save();
			        //top:'16.4rem',left:'16.1rem'
			        context.clearRect( 0 , 0 , canvas.width ,canvas.height );
			        context.translate(  canvas.width/2 + 16.1*10 , canvas.height/2 - 16.4*10 + 100 );
			        context.translate( imgInfo.x , imgInfo.y );
			        context.rotate( Math.PI/180*imgInfo.rotation );
			        context.scale( imgInfo.scale , imgInfo.scale );
			        context.drawImage(img,-img.width/2,-img.height/2);
			        context.restore();
			        context.save();
			        context.drawImage(maskImg,0,0);
			        context.restore();
			    }
				$('#upload').on('change', function(event) {
					event.preventDefault();
					imgInfo.rotation = 0;
			        imgInfo.x = 0;
			        imgInfo.y = 0;
			        imgInfo.scale = 1;
			        event.preventDefault();
			        var imgData = this.files[0];
			        EXIF.getData(imgData, function() {
			            var orientation = EXIF.getTag(this, "Orientation");
			            switch (orientation) {
			                case 3:
			                    imgInfo.rotation = 180;
			                    break;
			                case 6:
			                    imgInfo.rotation = 90;
			                    break;
			                case 8:
			                    imgInfo.rotation = 270;
			                    break;
			                default:
			                    imgInfo.rotation = 0;
			            }
			            if(navigator.userAgent.indexOf('iPhone') > -1){
			                imgInfo.rotation = 0;
			            }
			            lrz(imgData,{width: 480} ,  function (results){
			                img = new Image();
			                img.onload = function (){
			                	drawImage();
			                	$('.confirm').show();
			                };
			                img.src = results.base64;
			             });
			        });
			        return false;
					
				});
			}
			
		}
		var doorAdded = false;
	
		function addDoor(){
			if( doorAdded ){
				return;
			}
			if( roomID == 'coffee' ){
				doorAdded = true;
			}else{
				if( roomID != 'bedroom' ){
					if( scene.children.length > 1 ){
						return;
					}
				}
				var objWidth,objHeight,doorTexture;
				if (roomID == 'street') {
					objWidth = 150;
					objHeight = 180;
				}else{
					objWidth = 233;
					objHeight = 389;
				}
				var objPosition,objRotation;
				if( roomID == 'bedroom' ){
					objPosition = [ -200, -100, d ];
					objRotation = [ 0, 0, 0 ];	
				}else if( roomID == 'livingroom' ){
					objPosition = [ 0,-80, -d ] ;
					objRotation = [ 0, 3.14, 0  ];	 
				}else if( roomID == 'street' ){
					objPosition = [d,  45 , -80 ];
					objRotation = [  0, 1.57, 0 ];
				}
				doorTexture = loader.load( 'img/hand.png' );

				var ns = new TextureAnimator( doorTexture, 2, 1, 2,500 );
				NSs.push(ns);

				var geometry = new THREE.PlaneGeometry( objWidth, objHeight );
				var material = new THREE.MeshBasicMaterial( { map:doorTexture, transparent: true ,  side: THREE.DoubleSide,  depthWrite: false } );
				//transparent: true,
				var mesh = new THREE.Mesh( geometry, material );
				mesh.position.fromArray( objPosition );
				mesh.rotation.fromArray( objRotation );
				mesh.renderOrder = 1;
				mesh.name = 'door';
				//mesh.scale.copy( door.scale );
				scene.add( mesh );
				doorAdded = true;
				if( roomID != 'bedroom' ){
					changeText();
				}
			}
		}
		if( roomID == 'coffee' && catchs.length == 9 ){
			showUploadPage();
		}
		var target = new THREE.Vector3();
		var scene,camera,controls,renderer;
		var NSs = [];
		objects = [];

		camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
		scene = new THREE.Scene();
		
		if ( webglAvailable() ) {
			renderer = new THREE.WebGLRenderer();
		} else {
			renderer = new THREE.CanvasRenderer();
		}
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
		$(page).prepend( renderer.domElement );
		var isIos = true;
		if( navigator.userAgent.indexOf('iPhone') <= -1){
			isIos = false;
			//camera.position.set(0,0,1);
			// {x: -0.45299760384873106, y: -0.04426100036101418, z: -0.89041233973612}
			camera.position.set(-0.45299760384873106,-0.04426100036101418,-0.89041233973612);
			controls = new THREE.OrbitControls( camera , renderer.domElement  );
			controls.enableZoom = false;
			controls.enablePan = false;
			controls.maxDistance = 200;
			controls.rotateSpeed = 0.5;
			// controls.noZoom = true;
			// controls.noPan = true;
			// controls.staticMoving = true;
			// controls.rotateSpeed = 0.5;
			//controls.target.set(150, 0, 150);
		}else{
			controls = new THREE.DeviceOrientationControls(camera);
			controls.connect();
			controls.alphaOffsetAngle = 10;
		}

		var d = 512-2;
		// 1 2 3  0 4  5 
		var pos = [ [ 0, 0, d ], [ d, 0, 0 ], [ 0, 0, -d ], [ -d, 0, 0 ], [ 0, d, 0 ], [ 0, -d, 0 ] ];
		var rot = [ [ 0, 0, 0 ], [ 0, 1.57, 0 ], [ 0, 3.14, 0 ], [ 0, 4.71, 0 ], [ 4.71, 0, 1.57 ], [ 4.71,0,  0 ] ];

		// for ( var i = 0; i < 6 ;i ++ ) {
		// 	var img = document.createElement( 'img' );
		// 	img.src = imagePre +'0'+i+'.jpg';
		// 	var object = new THREE.CSS3DObject( img );
		// 	object.position.fromArray( pos[ i ] );
		// 	object.rotation.fromArray( rot[ i ] );
		// 	scene.add( object );

		// }

		var loader = new THREE.TextureLoader();
		var geometry = new THREE.BoxGeometry(1024, 1024, 1024);
		var materials = [
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '02.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        }),
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '00.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        }),
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '04.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        }),
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '05.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        }),
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '01.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        }),
	        new THREE.MeshBasicMaterial({
	                map: loader.load(imagePre + '03.jpg'),
	                overdraw: 0.5,
	                side: THREE.BackSide
	        })
		];
		var cube = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
		scene.add(cube);

		

		if( roomID == 'bedroom' ) {

			var nsTexture = loader.load( 'img/ns/xiaos.png' );
			var ns = new TextureAnimator( nsTexture, 17, 1, 17,200 );
			var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
			NSs.push( ns );
			var nsGeometry = new THREE.PlaneGeometry( 8192/17 , 500, 1, 1);
			var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			
			nsMesh.position.set( 230, -200, d  );
			nsMesh.rotation.set(  0, 3.14, 0  );

			scene.add( nsMesh );

		}else if (roomID == 'livingroom'){
			if( !in_array('1' , catchs ) ){

				var nsTexture = loader.load( 'img/ns/song.png' );
				var ns = new TextureAnimator( nsTexture, 3, 1, 3,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 420/3 , 249, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
				
				nsMesh.position.set( d , -220, -370  );
				nsMesh.rotation.set( 0, 1.57, 0  );
				nsMesh.name = 'man1';
				scene.add( nsMesh );
			}
			
			if( !in_array('2' , catchs ) ){

				var nsTexture = loader.load( 'img/ns/gao.png' );
				var ns = new TextureAnimator( nsTexture, 2, 1, 2,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 320/2 , 334, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
				
				nsMesh.position.set( 20, -200, d  );
				nsMesh.rotation.set( 0, 0, 0  );
				nsMesh.name = 'man2';
				scene.add( nsMesh );
			}
			
			if( !in_array('3' , catchs ) ){

				var nsTexture = loader.load( 'img/ns/cui.png' );
				var ns = new TextureAnimator( nsTexture, 3, 1, 3,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 420/3 , 292, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
				
				nsMesh.position.set( 30, -230, -d );
				nsMesh.rotation.set( 0, 0, 0  );
				nsMesh.name = 'man3';
				scene.add( nsMesh );

			}
			

		}else if (roomID == 'street'){
			if( !in_array('4' , catchs ) ){
				var nsTexture = loader.load( 'img/ns/li.png' );
				//console.log( nsTexture );
				var ns = new TextureAnimator( nsTexture, 2, 1, 2,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 320/2 , 334, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
				
				nsMesh.position.set(d , -20, -370 );
				nsMesh.rotation.set( 0, 1.57, 0  );
				nsMesh.name = 'man4';
				scene.add( nsMesh );
			}
			
			if( !in_array('5' , catchs ) ){
				var nsTexture = loader.load( 'img/ns/liu.png' );
				var ns = new TextureAnimator( nsTexture, 3, 1, 3,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 420/2 , 249, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			

				nsMesh.position.set(0, -100, d );
				nsMesh.rotation.set( 0, 0, 0  );
				nsMesh.name = 'man5';
				scene.add( nsMesh );

			}
			
			if( !in_array('6' , catchs ) ){
				var nsTexture = loader.load( 'img/ns/liu2.png' );
				var ns = new TextureAnimator( nsTexture, 2, 1, 2,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 360/2 , 249, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			

				nsMesh.position.set(-400, -80, -d );
				nsMesh.rotation.set( 0, 3.14, 0  );
				nsMesh.name = 'man6';
				scene.add( nsMesh );
			}
			
		}else if(roomID == 'coffee'){
			if( !in_array('9' , catchs ) ){
				var nsTexture = loader.load( 'img/ns/wu.png' );
				var ns = new TextureAnimator( nsTexture, 2, 1, 2,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 360/2 , 320, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			

				nsMesh.position.set(d , -200, -370 );
				nsMesh.rotation.set( 0, 1.57, 0 );
				nsMesh.name = 'man9';
				scene.add( nsMesh );
			}
			
			if( !in_array('8' , catchs ) ){

				var nsTexture = loader.load( 'img/ns/huang2.png' );
				var ns = new TextureAnimator( nsTexture, 3, 1, 3,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 420/3 , 320, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			

				nsMesh.position.set(150, -280, d );
				nsMesh.rotation.set( 0, 0, 0 );
				nsMesh.name = 'man8';
				scene.add( nsMesh );
			}
			
			if( !in_array('7' , catchs ) ){

				var nsTexture = loader.load( 'img/ns/tong.png' );
				var ns = new TextureAnimator( nsTexture, 2, 1, 2,200 );
				var nsMaterial = new THREE.MeshBasicMaterial( { map: nsTexture, transparent: true ,side:THREE.DoubleSide } );
				NSs.push( ns );
				var nsGeometry = new THREE.PlaneGeometry( 360/2 , 320, 1, 1);
				var nsMesh = new THREE.Mesh(nsGeometry, nsMaterial);
			

				nsMesh.position.set( 300, -300, -d   );
				nsMesh.rotation.set( 0, 0, 0 );
				nsMesh.name = 'man7';
				scene.add( nsMesh );
			}
			
		}


		if( roomID != 'bedroom' ){
			$('.ball').on('click', function(event) {
				leftTime = parseInt( leftTime );
				if( 0 && leftTime < 1 ){
					showUploadPage();
					return;
				}
				$('#throw').get(0).play();
				controlsLock = true;
				event.preventDefault();
				var id = 0;
				var obj = clickObj( 0 , 0 ,camera , scene.children );
				if( obj && obj.object && obj.object.name ){
					var name = obj.object.name;
					if( name.substr(0,3) == 'man' ){
						id = name.substr(3,1);
					}
				}
				$.post(throwLink, {id: id}, function(res) {
					if( res.catch ){
						$(page).addClass('animated');
						catchs.push( id );
						var flash = $('<div class="flashQuaern"></div>').appendTo(page);
						setTimeout( function(){
							var photoShow = false;
							if( $('.photoshow').length > 0 ){
								photoShow = $('.photoshow').show();
							}else{
								photoShow = $('<div class="photoshow"><div class="photo"></div></div>').appendTo('body');
							}
							photoShow.find( '.photo' ).html( '<img src="/img/photo/'+id+'.png" alt="" />' );
							setTimeout( function(){
								$('.photoshow').hide();
							},2000 );
							$('#catch').get(0).play();
						},500 );
						setTimeout( function(){
							scene.remove( obj.object );
							leftTime = parseInt( res.leftTime );
							controlsLock = false;
							$('.flashQuaern').remove();
							if( res.reward ){
								if( !isIos ){
									controls.enabled = false;
								}
								$('.page').hide();
								$('.aiqiyi,.shouji').hide();
								if( parseInt(res.reward ) == 1 ){
									$('.shouji').show();
								}else{
									$('.aiqiyi').show();
								}
								$('.page-264').show();
							}else{
								if( catchs.length == 9 ){
									setTimeout( function(){
										showUploadPage();
									} , 2000 );
									
								}
							}
						} ,1000 );
					}else{
						leftTime = parseInt( res.leftTime );
						controlsLock = false;
					}
				},'json');

			});
		}
		page.addEventListener( 'mousedown', function(event){
			var x = ( event.clientX / window.innerWidth ) * 2 - 1;
			var y =  - ( event.clientY / window.innerHeight ) * 2 + 1;
			var obj = clickObj(x,y ,  camera ,scene.children );

			if( obj && obj.object && obj.object.name && obj.object.name == 'door' ){
				if( roomID == 'bedroom' ){
					window.location.href = './livingroom.php';
				}else if( roomID == 'livingroom' ){
					window.location.href = './street.php';
				}else if( roomID == 'street' ){
					window.location.href = './coffee.php';
				}
			}
		}, false );
		var clock = new THREE.Clock();
		var lastUpdate =  new Date().getTime();
		animate();
		
		function animate() {
			if( !controlsLock ){
				controls.update();
			}
			addDoor();
			if( NSs.length > 0 ){
				var delta = 0;
				try {
					delta = clock.getDelta(); 
				} catch(err) {
					var now = new Date().getTime();
					delta = (now - lastUpdate)/1000;
					lastUpdate = now;
				}
				for (var i = NSs.length - 1; i >= 0; i--) {
					//console.log( NSs[i].currentDisplayTime );
					NSs[i].update( 1000 * delta );
				}
			}
			
	        requestAnimationFrame( animate );
	        renderer.render( scene, camera );
		}
	}
	if(  navigator.userAgent.indexOf('iPhone') <= -1  ){
		$.get(updateCatchsUrl, function(res) {
			catchs = res;
			dataIsOk = true;
			starShow();
		},'json');
	}else{
		dataIsOk = true;
		starShow();
	}
	$(document).on('touchmove',  function(event) {
		event.preventDefault();
		return false;
	});
//});


