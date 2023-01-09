$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
    }
});


(function(){var k=[].slice;String.prototype.autoLink=function(){var d,b,g,a,e,f,h;e=1<=arguments.length?k.call(arguments,0):[];f=/(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;if(!(0<e.length))return this.replace(f,"$1<a href='$2'>$2</a>");a=e[0];d=a.callback;g=function(){var c;c=[];for(b in a)h=a[b],"callback"!==b&&c.push(" "+b+"='"+h+"'");return c}().join("");return this.replace(f,function(c,b,a){c=("function"===typeof d?d(a):
void 0)||"<a href='"+a+"'"+g+">"+a+"</a>";return""+b+c})}}).call(this);

function addLinkToUrls (selector) {	
	se = $(selector);
	se.html(se.html().autoLink ({ target: "_blank",rel: "noreferrer"}))
}


var process_modal = 0;

$(document).on("click", '.show_item', function(e) {
	var $this = $(this);		
	var org = $this.html();
	$this.html ("loading ...");
	$this.attr ("disabled",'disabled');		
	var $itemid = $this.data("id");
	var $itemhref = $this.data("href");

	var span_id = $("#showItemModal").find (".item_id_span");
	var item_body = $("#showItemModal").find (".item_body");
	
	span_id.text ($itemid);

	item_body.load($itemhref,function() {
		$this.removeAttr("disabled");	
		$this.html (org);
		$("#showItemModal").modal("show");
	});
});
var reqSeo = 0;
$(document).on("click", '.get_seo_details', function(e) {
	if (reqSeo < 1) {
		reqSeo =1;
		
		var $this = $(this);		
		var org = $this.html();
		$this.html ("loading ...");
		$this.attr ("disabled",'disabled');		
		var $itemid = $this.data("id");
		var $itemhref = $this.data("href");
		var item_body = $("#SeoDetailsModal").find (".seo_item_body");
		
		item_body.load($itemhref,function() {
			$this.removeAttr("disabled");	
			$this.html (org);
			$("#SeoDetailsModal").modal("show");
			reqSeo = 0;
		});
	}
	else {
		swal(
			  'Limit Exceeded!',
			  "You've Exceeded the limit of requests Per Once [1]",
			  'warning'
					);	
	}
});

$(document).on("click", '.show-ajax-modal', function(e) {
	
	if (process_modal == 0) {
	
		var $btn = $(this);
		var org = $btn.html();
		$btn.attr("disabled", 'disabled');
		var $href = $btn.data("href");
		var $modal = $btn.data("target");
		var $target = $($btn.data("target")).find(".modal-body");
		 $.ajax({
			type: "get",
			url: $href,        
			//dataType: 'json',
			beforeSend: function() {        
				$btn.html ("Loading ....");
			},
			
			success: function(data) {

				$target.html (data);	
				$($modal).modal('show');				
			},
			complete: function(data) {	
				process_modal = 0;
				$btn.html (org);
				$btn.removeAttr("disabled");	
			},
			error: function(request, x, y) {
			   
			}
		});
	
	}
	else {
		alert  ("Only One request is allowed");
	}
});

$(document).on("click",".confirm_ajax",function() {
	event.preventDefault();
	var token = $('meta[name="csrf_token"]').attr('content');
	var id = $(this).data('id');
	var url = $(this).data('href');
	var modalTitle = $(this).data('title')?$(this).data('title'):"Are You Sure?";
	var modalText = $(this).data('text')?$(this).data('text'):"";
	var $that = $(this);

	swal({

		title: modalTitle,
		text: modalText,
		type: "info",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes!",
		cancelButtonText: "Cancel",
		closeOnConfirm: false
	}

	).then(function(result) {
		if (result.value) {
			$.ajax({
				url:  url,
				type: 'post',
				dataType: 'json',
				data: {
					'id': id,
					'_token': token
				},

				success: function(data) {

					if (data.status == 'success') {						
						swal("Success", data.message, "success");
						if (data.reload) {							
							location.reload();				
						}

					} else {
						swal("Error!", data.message, "error");
					}
				},

				error: function(request, options, thrownError) {
					swal("Request Error!", "please refresh page and retry again ..", "error");
				},

				beforeSend: function() {
					  swal({
							 title: "Loading ...",						  
							 confirmButtonText: "Ok"
						}); 
				}
			});
		}
	});

});


$(document).on("submit", '.ticket-reply', function(e) {
    var $form  = $(this);
    var $input = $form.find(':submit');
	var $reset = $form.data("reset") ? true : false;
    var originalInPut = $input.clone();
	$input.attr("disabled", 'disabled');
    var dataz = $form.serializeArray();
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: dataz,
        dataType: 'json',
        beforeSend: function() {        
			$input.html ("Loading ....");
        },
		
        success: function(data) {
            
            $("#ticket_replies").load ($form.data('repliesurl'),function () {
				$input.replaceWith(originalInPut);	
				$form.trigger('reset');
				if (typeof(grecaptcha) != 'undefined') {
					grecaptcha.reset();
				}
				addLinkToUrls(".ticket_wrapper_main");
				$("#ticket_replies .ticket-reply-one:last-child").fadeOut(1000);
				$("#ticket_replies .ticket-reply-one:last-child").fadeIn(1000);
				
			});
			
			
        },
        error: function(request, x, y) {
            if (request.status == 422) {
                var errorsHtml = "";
                $.each(request.responseJSON.errors, function(key, value) {
                    errorsHtml += '' + value[0] + '<br/>';
                });
                swal({
                    title: "Error",
                    html: errorsHtml,
                    type: "error",
                    confirmButtonText:  "Ok"
                });
            } else {
                swal({
                    title: "Error",
                    html: "Error",
                    type: "error",
                    confirmButtonText: "Ok"
                });
            }
        }
    });
    e.preventDefault();
});

$(document).on("submit", '.ajaxform', function(e) {
    var $form = $(this);
    var $input = $form.find(':submit');
	var $reset = $form.data("reset") ? true : false;
    $input.attr("disabled", 'disabled');
 
    var dataz = $form.serializeArray();
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: dataz,
        dataType: 'json',
        success: function(data) {

            if (data.redirect) {
                
				
                swal({
                    title: "Redirecting ..",
                    html: data.message,
                    type: "info",
                    confirmButtonText: "Ok"
                });
				
				setTimeout(function(){ 
				
					window.location.href = data.redirect;
				}, 3000);
				
            } else {
				var typeStatus =  data.status;
                swal({
                    title: typeStatus,
                    html: data.message,
                    type: typeStatus,
                    confirmButtonText: "Ok"
                });
            }
			if ($reset) {					
				$form.trigger('reset');
			}
			
			if (data.reload) {
				
				setTimeout(function(){ 			
					location.reload();
				}, 3000);
				
			}
        },
        error: function(request, x, y) {
            if (request.status == 422) {
                var errorsHtml = "";
                $.each(request.responseJSON.errors, function(key, value) {
                    errorsHtml += '' + value[0] + '<br/>';
                });
                swal({
                    title: "Error",
                    html: errorsHtml,
                    type: "error",
                    confirmButtonText:  "Ok"
                });
            } else {
                swal({
                    title: "Error",
                    html: "Error",
                    type: "error",
                    confirmButtonText: "Ok"
                });
            }
        },
        complete: function(data) {
            $input.removeAttr("disabled");
            if (typeof(grecaptcha) != 'undefined') {
                grecaptcha.reset();
            }
        },
        beforeSend: function() {
            swal({
                title: "Loading ..",
				type: "info",
                confirmButtonText: "Ok"
            });
        },
    });
    e.preventDefault();
});

$(document).on("click",'.view-more-iframe',function (e) {
	e.preventDefault();
	var myWindow = window.open($(this).data("href"), "Samme", "width=700,height=500");
});


 $(window).on('popstate', function (e) {
        var state = e.originalEvent.state;
        if (state !== null) {     
			//alert (state.url);
			location.href = (state.url);
           // load(state.url,state.title);
        } /*else {
            document.title = 'Home ';
            $("#content").empty();
        }*/
    });

function copyToClipboard(element) {
	var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
	if (isChrome) {
		var $temp = $("<input  style = 'position :fixed;left:-9999px;'>");
	}
	else {
  //
  var $temp = $("<span id = 'textToCopy' style = 'position :fixed;left:-9999px;'></span>");
  }
  var copied;
  $("body").append($temp);

  if (element.is("input")) {
	copied = $(element).val();
  }
  else {
	  copied = $(element).text();
  }
 
 if (isChrome) {
  $temp.attr('value',copied);  
  $temp.select();
  $temp.focus();
  }
  else {
	$temp.text(copied);
	var range = document.createRange();
	var textToCopy = $temp[0];
	range.selectNodeContents(textToCopy);
	window.getSelection().addRange(range);
   }
  document.execCommand("copy");
	$temp.remove();


}



function clearSelection()
{
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}


$(document).on("click",'.copyToClipboard',function (e) {
	
	clearSelection();
	var target = $(this).data("target");
	var $btn = $(this);
	
	var org = $btn.html();
	copyToClipboard($(target));
	$btn.removeClass("btn-danger");
	$btn.addClass("btn-success");
	$btn.html("Copied");
	
	setTimeout(function(){ 
		$btn.addClass("btn-danger");
		$btn.removeClass("btn-success");
		$btn.html(org);
	}, 3000);
});



$(document).on("click",'.confirm-click-a',function (e) {
	e.preventDefault();
	var href = $(this).attr("href");
	swal({

		title: "Are You sure?",
		text: "",
		type: "info",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes!",
		cancelButtonText: "Cancel",
		closeOnConfirm: false
	}

	).then(function(result) {
		if (result.value) {
			location.href = href;
		}
	});
	
});
