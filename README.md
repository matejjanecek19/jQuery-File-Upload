# jQuery-File-Upload
```javascript
$(function(){
				fileUploader({
					dropHandler: $("#handler"),
					fileInputName: "file",
					multiple: true,
					action: "./upload.php",
					onDragEnter: function(){
						//css
						this.dropHandler.css("background", "red");
					},
					onDragOver: function(){
						//css
						this.dropHandler.css("background", "green");
					},
					onDragOut: function(){
						//css
						this.dropHandler.css("background", "black");
					},
					progressObject: function fileProgress(file_info){
						this.file_info = file_info;
						this.progress = $("<div></div>");
						this.progress.css({
							width: 0,
							height: 100,
							"background-size": "cover",
							"background-color": "red"
						});
						this.progress.appendTo($("body"));
						if($.inArray(file_info.type, ["image/gif", "image/jpeg", "image/png"]) > -1){
							var reader = new FileReader();
							reader.onload = (function(obj){
								return function(e){
									obj.progress.css("background-image", "url("+this.result+")");
								};
							})(this);
							reader.readAsDataURL(file_info);
						}
						
						this.update = function(percent, upload_progress){
							this.progress.css("width", percent + "px");
							this.progress.html(Math.round(upload_progress.time_remaining) + "s" + Math.round(upload_progress.mbps*100)/100 + " <br>" +this.file_info.name + " " + Math.round(percent*100)/100 + "%");
						}
						this.progress.on("click", {upload_progress: this}, function(e){
							e.data.upload_progress.ajax.abort();
							e.data.upload_progress.progress.remove();
						});
					}
				});
			});
```
