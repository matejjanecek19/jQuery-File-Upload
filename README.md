# jQuery-File-Upload
```javascript
fileUploader({
	dropHandler: $("#handler"),
	fileInputName: "file", // filename
	multiple: true,
	action: "./upload.php", // file to upload
	onDragEnter: function(){
		// you drag file into document
	},
	onDragOver: function(){
		// you drag file above handler
	},
	onDragOut: function(){
		// reset default css
	},
	onSuccess: function(){
		// called when upload successfully
	},
	onError: function(){
		// called when error occur
	},
	progressObject: function fileProgress(file_info){
		this.file_info = file_info;
		// here create element with progress bar
		/*
		image preview
		if($.inArray(file_info.type, ["image/gif", "image/jpeg", "image/png"]) > -1){
			var reader = new FileReader();
			reader.onload = (function(obj){
				return function(e){
					this.result; // contains image src
				};
			})(this);
			reader.readAsDataURL(file_info);
		}
		*/
		this.update = function(upload_progress){ // method called when progress changed
			// update progress bar
			
			// upload_progress.percentage
			// upload_progress.mbps
			// upload_progress.time_remaining
			// upload_progress.seconds_elapsed
			
			// e.data.upload_progress.progress.remove(); to abort upload
		}
	}
});
```
