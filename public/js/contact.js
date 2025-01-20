/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Header Search
4. Search Panel
5. Cart Hover
6. Init Menu
7. Init Accordions


******************************/

$(document).ready(function()
{
	"use strict";

	/* 

	1. Vars and Inits

	*/

	initHeaderSearch();
	initSearchPanel();
	initCartHover();
	setHeader();
	initMenu();
	initAccordions();

	// Fix parallax on resize and set header on scroll
	$(window).on('resize', function()
	{
		setHeader();

		setTimeout(function()
		{
			$(window).trigger('resize.px.parallax');
		}, 375);
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		let header = $('.header');
		let menu = $('.menu');

		if($(window).scrollTop() > 180)
		{
			header.addClass('scrolled fixed');
			menu.addClass('scrolled');
		}
		else
		{
			header.removeClass('scrolled fixed');
			menu.removeClass('scrolled');
		}
	}

	/* 

	3. Header Search

	*/

	function initHeaderSearch()
	{
		$('#header_search_input').on('focus', function()
		{
			$('.header_search_suggestions_container').addClass('enabled');
		});
	
		$('#header_search_input').on('blur', function(event)
		{
			// Use setTimeout to allow click event on suggestions panel to trigger first
			setTimeout(function()
			{
				if (!$('.header_search_suggestions_container').is(':hover'))
				{
					$('.header_search_suggestions_container').removeClass('enabled');
				}
			}, 100);
		});
	
		$('.header_search_suggestions_container').on('mousedown', function(event)
		{
			// Prevent the blur event on input when clicking the suggestions panel
			event.preventDefault();
		});
	}

	/* 

	4. Search Panel

	*/

	function initSearchPanel()
	{
		let searchButton = $('.menu_search');
		let searchPanel = $('.search_panel');
		let html = $('html');

		if(searchPanel.length)
		{
			html.on('click', function()
			{
				searchPanel.removeClass('enabled');
				searchButton.removeClass('enabled');
			});

			searchButton.on('click', function(event)
			{
				event.stopPropagation();
				searchPanel.toggleClass('enabled');
				searchButton.toggleClass('enabled');
			});

			searchPanel.on('click', function(event)
			{
				event.stopPropagation();
			});
		}
	}

	/* 

	5. Cart Hover

	*/

	function initCartHover()
	{
		let cart_button = $('.header_cart');
		let cart_panel = $('.cart_hover_panel');

		cart_button.on('mouseenter', function(event)
		{
			cart_panel.addClass('enabled');
		});

		cart_button.on('mouseleave', function(event)
		{
			cart_panel.removeClass('enabled');
		});
	}

	/* 

	6. Init Menu

	*/

	function initMenu()
	{
		let menu_button = $('.header_hamburger');
		let search_button = $('.menu_search');
		let menu = $('.menu');
		let html = $('html');

		if(menu.length)
		{
			html.on('click', function()
			{
				menu.removeClass('enabled');
				menu_button.removeClass('enabled');
			});

			menu_button.on('click', function(event)
			{
				event.stopPropagation();
				menu.toggleClass('enabled');
				menu_button.toggleClass('enabled');
			});

			search_button.on('click', function()
			{
				menu.removeClass('enabled');
				menu_button.removeClass('enabled');
			});

			menu.on('click', function(event)
			{
				event.stopPropagation();
			});
		}
	}

	/* 

	7. Init Accordions

	*/

	function initAccordions()
	{
		if($('.accordion').length)
		{
			let accs = $('.accordion');

			accs.each(function()
			{
				let acc = $(this);

				if(acc.hasClass('active'))
				{
					let panel = $(acc.next());
					let panelH = panel.prop('scrollHeight') + "px";
					
					if(panel.css('max-height') == "0px")
					{
						panel.css('max-height', panelH);
					}
					else
					{
						panel.css('max-height', "0px");
					} 
				}

				acc.on('click', function()
				{
					if(acc.hasClass('active'))
					{
						acc.removeClass('active');
						let panel = $(acc.next());
						let panelH = panel.prop('scrollHeight') + "px";
						
						if(panel.css('max-height') == "0px")
						{
							panel.css('max-height', panelH);
						}
						else
						{
							panel.css('max-height', "0px");
						} 
					}
					else
					{
						acc.addClass('active');
						let panel = $(acc.next());
						let panelH = panel.prop('scrollHeight') + "px";
						
						if(panel.css('max-height') == "0px")
						{
							panel.css('max-height', panelH);
						}
						else
						{
							panel.css('max-height', "0px");
						} 
					}
				});
			});
		}
	}

});