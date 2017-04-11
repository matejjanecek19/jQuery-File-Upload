function fileUploader(options){
	this.options = $.extend({
		dropHandler: false, // $()
		multiple: false,
		fileInputName: "file",
		method: "POST",
		allow: [],
		data: {},
		dataType: "text",
		counter: 0,
		onSuccess: function(data, upload_progress){
		},
		onError: function(){
		},
		onDragEnter: function(){
		},
		onDragOver: function(){
		},
		onDragOut: function(){
		},
		progressObject: function(file_info){
			this.update = function(file_info){
			}
		},
		onWrongFileType: function(){
		},
		action: ""
	}, options);
	_this = this;
	if(this.options.dropHandler){
		counter = 0;
		$(document).on('dragover drop', function(e){
			e.stopPropagation(); e.preventDefault();
			_this.options.onDragEnter();
		});
		$(document).on('dragenter', function(e){
			e.stopPropagation();
			e.preventDefault();
			_this.options.onDragEnter();
			counter++;
		});
		$(document).on('dragleave', function(e){
			
			counter--;
			if(counter <= 0){
				_this.options.onDragOut();
				counter = 0;
			}
		});
		this.options.dropHandler.on('dragenter', function (e){
			e.stopPropagation();
			e.preventDefault();
			_this.options.onDragEnter();
		});
		this.options.dropHandler.on('dragover', function (e){
			e.stopPropagation();
			e.preventDefault();
			_this.options.onDragOver();
		});
		this.options.dropHandler.on('drop', function (e){
			
			_this.options.onDragOut();
			e.preventDefault();
			var files = e.originalEvent.dataTransfer.files;
			
			for (var i = 0; i < files.length; i++){
				var formdata = new FormData();
				formdata.append(_this.options.fileInputName, files[i]);
				_this.upload(formdata);
			}
		});
	}
	
	file = $("<input>");
	file.css("display", "none");
	file.prop("type", "file");
	file.prop("name", this.options.fileInputName);
	if(this.options.multiple) file.prop("multiple", true);
	
	file.appendTo($("body"));
	
	this.options.dropHandler.click(function(){
		file.trigger('click');
	});
	file.change(function(){
		for(var i = 0; i < $(this).get(0).files.length; i++){
			var formdata = new FormData();
			formdata.append(_this.options.fileInputName, $(this).get(0).files[i]);
			_this.upload(formdata);
		}
	}); 
	
	this.upload = function(formdata){
		if($.inArray(formdata.get(this.options.fileInputName).type, this.options.allow) == -1 && this.options.allow.length > 0){
			this.options.onWrongFileType();
			return false;
		}
		this.options.counter++;
		var upload_progress = new this.options.progressObject(formdata.getAll(this.options.fileInputName)[0]);
		upload_progress.fileUploadObj = this;
		
		$.each(upload_progress.fileUploadObj.options.data, function(name, value){
			formdata.append(name, value);
		});
		upload_progress.ajax = $.ajax({
			url: upload_progress.fileUploadObj.options.action,
			type: upload_progress.fileUploadObj.options.method,
			xhr: function(){
				upload_progress.start_time = new Date();
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function(evt) {
					if(evt.lengthComputable){
						upload_progress.loaded = evt.loaded;
						upload_progress.total = evt.total;
						upload_progress.seconds_elapsed = ( new Date().getTime() - upload_progress.start_time.getTime() )/1000;
						upload_progress.kbps = (upload_progress.seconds_elapsed ? (evt.loaded / upload_progress.seconds_elapsed) : 0) / 1024;
						upload_progress.mbps = upload_progress.kbps/1024;
						upload_progress.time_remaining = upload_progress.seconds_elapsed ? (upload_progress.total - upload_progress.loaded) / (upload_progress.kbps*1024) : "???";
						upload_progress.percentage = evt.loaded / evt.total * 100;
						upload_progress.update(upload_progress);
					
					}
			   }, false);


			   return xhr;
			},
			global: false,
			cache: false,
			contentType: false,
			dataType: upload_progress.fileUploadObj.options.dataType,
			processData: false,
			forceSync: false,
			data: $.extend(formdata, upload_progress.fileUploadObj.options.data),
			success: function (data){
				upload_progress.fileUploadObj.options.onSuccess(data, upload_progress);
				upload_progress.fileUploadObj.options.counter--;
			},
			error: function (a,b,c){
				if(a.statusText == "abort") return;
				upload_progress.fileUploadObj.options.onError(a, b, c);
				upload_progress.fileUploadObj.options.counter--;
			}
		});
	}
}