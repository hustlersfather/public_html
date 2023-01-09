var currentRequest = null;

/*
setInterval(function() {
   refresh();
}, 60 * 1000); */




$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
var Process_limit = 10;
$(document).on("click",'.check_up_item',function (e) {
	if (!$(this).hasClass("clicked_btn_no_click")) {
		if (Process_limit > 0) {
			Process_limit --;
			var $input = $(this);
			var org = $input.html();
			$input.html ("loading ...");
			$input.attr ("disabled",'disabled');
			var id = $input.data("id");
			var $url= $input.data("href");
			var $buy_button_cont = $input.parents ("tr");
			var $buy_button = $buy_button_cont.find('.buy_button');
			$buy_button.attr ("disabled",'disabled');
			currentRequest =  $.ajax({
				type: "post",
				url: $url,
				data: {id:id},
				dataType: 'json',
				success: function(data) {
					$input.removeClass("btn-primary");
					$input.html (data.message);	
					if (data.status == 'success') {				
						$input.addClass("btn-success");
						$input.addClass("clicked_btn_no_click");
					}
					else if (data.status == 'error') {				
						$input.addClass("btn-danger");
						$input.addClass("clicked_btn_no_click");
					}
					else {
						$input.addClass("btn-primary");
						$input.html (org);
					}
					
				
				},
				error: function(request,x,y) {	
					$input.html ("Not Working");
					$input.removeClass("btn-primary");
					$input.addClass("btn-danger");
					
					if (request.status == 401 || request.status == 503) {
						location.reload();
					}
					
				},
				complete: function(data) {	
					Process_limit ++;
					$input.removeAttr("disabled");	
					$buy_button.removeAttr ("disabled");
				},
				beforeSend: function () {
					
					
				},
				});
			}
			else {
				swal(
					  'Limit Exceeded!',
					  "You've Exceeded the limit of requests Per Once [10]",
					  'warning'
							);			
			}
	}	
	e.preventDefault();
});



var Process_send_limit = 10;
$(document).on("click",'.check_send_item',function (e) {
	if (!$(this).hasClass("clicked_btn_no_click")) {
		if (Process_send_limit > 0) {
			Process_send_limit --;
			var $input = $(this);
			var org = $input.html();
			$input.html ("loading ...");
			$input.attr ("disabled",'disabled');
			var id = $input.data("id");
			var $url= $input.data("href");
			
			currentRequest =  $.ajax({
				type: "post",
				url: $url,
				data: {id:id},
				dataType: 'json',
				success: function(data) {
					$input.removeClass("btn-primary");
					$input.html (data.message);	
					if (data.status == 'success') {				
						$input.addClass("btn-success");
						$input.addClass("clicked_btn_no_click");
					}
					else if (data.status == 'error') {				
						$input.addClass("btn-danger");
						$input.addClass("clicked_btn_no_click");						
					}
					else {
						$input.addClass("btn-primary");
						$input.html (org);
					}
					
				
				},
				error: function(request,x,y) {	
					$input.html ("Not Working");
					$input.removeClass("btn-primary");
					$input.addClass("btn-danger");
					if (request.status == 401 || request.status == 503) {
						location.reload();
					}
					
				},
				complete: function(data) {	
					Process_send_limit ++;
					$input.removeAttr("disabled");	
				},
				beforeSend: function () {
					
					
				},
				});
			}
			else {
				swal(
					  'Limit Exceeded!',
					  "You've Exceeded the limit of requests Per Once [10]",
					  'warning'
							);			
			}
	}	
	e.preventDefault();
});


$(document).on("click",'.btn-rfrsh',function (e) {
	
});
	
	
$(document).on("click",'#navbar_id li',function (e) {	
  $("nav .nav-item").removeClass("active");
  $(this).addClass("active");
});

$(document).on("click",'.removeEm',function (e) {
		
	var $url  = $(this).data("url");
	var $input =  $(this);	
		
	swal({
	  title: 'Are you sure?',
	  text: "You won't be able to revert this!",
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Yes, delete it!'
	}).then((result) => {
	  if (result.value) {
		  
		  currentRequest =  $.ajax({
				type: "post",
				url: $url,
				data: {ok:"ok"},
				dataType: 'json',
				success: function(data) {
							
					if (data.status == 'success') {
			
						 swal(
							  'Deleted!',
							  'Your data has been deleted successfully.',
							  'success'
							);
					}
					if (data.reload == 'true') {
						refresh ();
					}
				
				},
				error: function(request,x,y) {		
					
				},
				complete: function(data) {												
					$input.removeAttr("disabled");	
				},
				beforeSend: function () {
					$input.attr("disabled",'disabled');	
					if(currentRequest != null) {
						currentRequest.abort();
					}
				
				},
		});
		
	   
	  }
});
	
});




var load = function (url,title) {
	$('.navbar-collapse').collapse('hide');
	$.ajax({
		url: url,
		cache: false,
		beforeSend: function(){
			$("#main_content").html('<div class="loading">Loading&#8230;</div>');
		},		
		success:function(data){
			$("#main_content").html(data);
			history.pushState({
				url: url,
				title: title
				}, title, url);
				
			if (title) {
				document.title = title;
			}
			
			u = new URL(url);			
			ga('set', 'page', u.pathname);
			ga('send', 'pageview');

		},
		error: function (request,x,y) {
		
			if (request.status == 401 || request.status == 503) {
				location.reload();
			}
					
		}
	});

};
	
$(document).on("click",'#navbar_id a:not(.noAjax)',function (e) {
	 var $this = $(this),
		 url = $this.attr("href");
    var title = $this.data("title") ? $this.data("title") : $this.text();

	if (isURL (url)) {
		load(url,title);
		e.preventDefault();
	}
});


	
$(document).on("click",'.pagination a,.ajax_load_url',function (e) {
	var $this = $(this),
	 url = $this.attr("href");
    var title = false;

	if (isURL (url)) {
		load(url,title);
		e.preventDefault();
	}
});



