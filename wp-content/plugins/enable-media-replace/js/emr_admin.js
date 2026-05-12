var emrIf=function($){var source_type;var source_is_image;var target_type;var target_is_image;var is_debug=false;var is_dragging=false;this.init=function(){if(emr_options.is_debug){this.is_debug=true;this.debug('EMR Debug is active');}
$('input[name="timestamp_replace"]').on('change',$.proxy(this.checkCustomDate,this));$('input[name="replace_type"]').on('change',$.proxy(this.showReplaceOptions,this));$('input[name="userfile"]').on('change',$.proxy(this.handleImage,this));$('.replace_custom_date').on('click',$.proxy(this.updateCustomDate,this));document.addEventListener('dragover',this.dragOverArea.bind(this),false);document.addEventListener('dragleave',this.dragOutArea.bind(this),false);$('.emr_drop_area').on('drop',$.proxy(this.fileDrop,this));$('.upload-file-action').on('click',function(){var input=document.getElementById('upload-file').click();});this.checkCustomDate();this.loadDatePicker();var source=$('.image_placeholder').first();if(typeof($(source).data('filetype'))!=='undefined'){source_type=$(source).data('filetype').trim();this.debug('detected type - '+source_type);}
else
source_type='';if(source.hasClass('is_image')){source_is_image=true;}
this.updateTextLayer(source,false);this.showReplaceOptions();}
this.loadDatePicker=function(){$('#emr_datepicker').datepicker({dateFormat:emr_options.dateFormat,onClose:function(){var date=$(this).datepicker('getDate');if(date){var formattedDate=(date.getFullYear())+"-"+
(date.getMonth()+1)+"-"+
date.getDate();$('input[name="custom_date_formatted"]').val(formattedDate);}},});}
this.checkCustomDate=function(){if($('input[name="timestamp_replace"]:checked').val()==3)
this.showCustomDate();else
this.hideCustomDate();}
this.showCustomDate=function(){$('.custom_date').css('visibility','visible').fadeTo(100,1);}
this.hideCustomDate=function(){$('.custom_date').fadeTo(100,0,function(){$('.custom_date').css('visibility','hidden');});}
this.handleImage=function(e){this.toggleErrors(false);var target=e.target;var file=target.files[0];if(!target.files||target.files.length<=0){if($('input[name="userfile"]').val().length>0)
this.checkSubmit();console.log('FileAPI not detected');return false;}
var status=this.checkUpload(file);this.debug('check upload status '+status);this.debug('file size:'+file.size);if(status){this.updatePreview(file);}
else{this.updatePreview(null);}
this.checkSubmit();}
this.updatePreview=function(file){var preview=$('.image_placeholder').last();$(preview).find('img').remove();$(preview).removeClass('is_image not_image is_document');var is_empty=false;if(file!==null){target_is_image=(file.type.indexOf('image')>=0)?true:false;target_type=file.type.trim();}
else{is_empty=true;}
if(file&&target_is_image){var img=new Image();img.src=window.URL.createObjectURL(file);self=this;img.addEventListener("load",function(){var width=img.naturalWidth;var height=img.naturalHeight;if(width==0)
width=img.width;if(height==0)
height=img.height;img.setAttribute('style','z-index:2; position: relative; max-width:100%; max-height: 100%; width: '+width+'px; height: '+height+'px;');self.updateTextLayer(preview,width+' x '+height);self.updateFileSize(preview,file);});$(preview).prepend(img);$(preview).addClass('is_image');}
else if(file===null){$(preview).addClass('not_image');$(preview).find('.dashicons').removeClass().addClass('dashicons dashicons-no');this.updateTextLayer(preview,'');this.updateFileSize(preview,null);this.debug('File is null');}
else{$(preview).addClass('not_image is_document');$(preview).find('.dashicons').removeClass().addClass('dashicons dashicons-media-document');this.updateTextLayer(preview,file.name);this.updateFileSize(preview,file);this.debug('Not image, media document');}
if(!is_empty&&target_type!=source_type){this.debug(target_type+' not '+source_type);var falsePositive=this.checkFalsePositiveType(source_type,target_type);if(!falsePositive)
this.warningFileType(source_type,target_type);}
if(!is_empty&&emr_options.allowed_mime.indexOf(target_type)==-1){this.debug(target_type+' not '+' in allowed types ');var falsePositive=this.checkFalsePositiveType(source_type,target_type);if(!falsePositive)
this.warningMimeType();}}
this.checkFalsePositiveType=function(source_type,target_type){if(source_type.indexOf('zip')>=0&&target_type.indexOf('zip')>=0){this.debug('Finding '+source_type+' '+target_type+' close enough, false positive');return true;}
return false;}
this.updateTextLayer=function(preview,newtext){textlayer=$(preview).find('.textlayer');textlayer.css('opacity','0');if(newtext!==false)
textlayer.text(newtext);if(textlayer.text()!==''){textlayer.css('opacity','0.7');}}
this.updateFileSize=function(preview,file){if(file===null){$(preview).find('.image_size').text('');return;}
var bytes=file.size;if(bytes==0){return"0.00 B";}
var e=Math.floor(Math.log(bytes)/ Math.log(1024));var size=(bytes/Math.pow(1024,e)).toFixed(2)+' '+' KMGTP'.charAt(e)+'B';$(preview).find('.image_size').text(size);}
this.updateCustomDate=function(e){var $target=$(e.target);var min=$target.data('min');var hour=$target.data('hour');var date=$target.data('date');var format=$target.data('format');$('input[name="custom_date"]').val(date);$('input[name="custom_hour"]').val(hour);$('input[name="custom_minute"]').val(min);$('input[name="custom_date_formatted"]').val(format);}
this.checkSubmit=function(){var check=($('input[name="userfile"]').val().length>0)?true:false;if(check){$('input[type="submit"]').prop('disabled',false);}
else{$('input[type="submit"]').prop('disabled',true);}}
this.toggleErrors=function(toggle){$('.form-error').fadeOut();$('.form-warning').fadeOut();}
this.checkUpload=function(fileItem){var maxsize=emr_options.maxfilesize;if($('input[name="userfile"]').val().length<=0){console.info('[EMR] - Upload file value not set in form. Pick a file');$('input[name="userfile"]').val('');return false;}
if(fileItem.size>maxsize){console.info('[EMR] - File too big for uploading - exceeds upload limits');this.errorFileSize(fileItem);$('input[name="userfile"]').val('');return false;}
return true;}
this.errorFileSize=function(fileItem){$('.form-error.filesize').find('.fn').text(fileItem.name);$('.form-error.filesize').fadeIn();}
this.warningFileType=function(source_type,target_type){$('.form-warning.filetype').find('.source_type').text(source_type);$('.form-warning.filetype').find('.target_type').text(target_type);$('.form-warning.filetype').fadeIn();}
this.warningMimeType=function(fileItem){$('.form-warning.mimetype').fadeIn();}
this.debug=function(message){console.debug(message);}
this.showReplaceOptions=function(e){$('section.options .location_option').hide();var replace_option=$('input[name="replace_type"]:checked').val();if(replace_option=='replace_and_search'){$('section.options .location_option').show();}}
this.dragOverArea=function(e){e.preventDefault();e.stopPropagation();console.log(e);if(true==this.is_dragging)
return;var el=document.getElementById('emr-drop-area');var showEl=el.cloneNode(true);showEl.id='emr-drop-area-active';var child=document.body.appendChild(showEl);child.addEventListener('drop',this.fileDrop.bind(this),false);child.addEventListener('dragover',function(event){event.preventDefault();})
this.is_dragging=true;}
this.dragOutArea=function(e){if(typeof e!=='undefined'){e.preventDefault();e.stopPropagation();if(e.clientX!=0||e.clientY!=0){return false;}}
var removeEl=document.getElementById('emr-drop-area-active');if(removeEl!==null)
document.getElementById('emr-drop-area-active').remove();this.is_dragging=false;}
this.fileDrop=function(e){this.dragOutArea();e.stopPropagation();e.preventDefault();if(e.dataTransfer.items){document.getElementById('upload-file').files=e.dataTransfer.files;$('input[name="userfile"]').trigger('change');}}}
jQuery(document).ready(function($){window.enableMediaReplace=new emrIf($);window.enableMediaReplace.init();});function emrDelayedInit(){console.log('Checking delayed init ');if(typeof window.enableMediaReplace=="undefined"){console.log(emrIf);window.enableMediaReplace=new emrIf(jQuery);window.enableMediaReplace.init();}
else if(typeof window.enableMediaReplace!=='undefined'){}
else{setTimeout(emrdelayedInit,3000);}}
setTimeout(emrDelayedInit,3000);