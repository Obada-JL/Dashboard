/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Header Search
4. Search Panel
5. Cart Hover
6. Init Menu
7. Testimonials Slider
8. Brands Marquee
9. Blog Slider


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
	initTestimonialsSlider();
	initBrandsMarquee();
	initBlogSlider();

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

	7. Testimonials Slider

	*/

	function initTestimonialsSlider()
	{
		if($('.testimonials_slider').length)
		{
			let slider = $('.testimonials_slider');
			
			let prev = slider.siblings('.slider_nav_btn_prev');
			let next = slider.siblings('.slider_nav_btn_next');

			slider.owlCarousel(
			{
				loop:true,
				margin:24,
				nav:false,
				dots: false,
				items: 1
			});

			// Slider navigation buttons
			if(prev.length)
				{
					prev.on('click', function()
					{
						slider.trigger('prev.owl.carousel');
					});
				}

			if(next.length)
			{
				next.on('click', function()
				{
					slider.trigger('next.owl.carousel');
				});
			}
		}
	}

	/* 

	8. Brands Marquee

	*/

	function initBrandsMarquee()
	{
		if ($(".marquee_mode").length)
		{
			$('.marquee_mode').marquee(
			{
				speed: 20,
				gap: 0,
				delayBeforeStart: 0,
				direction: 'left',
				duplicated: true,
				pauseOnHover: true,
				startVisible:true,
			});
		}
	}

	/* 

	9. Blog Slider

	*/

	function initBlogSlider()
	{
		if($('.blog_slider').length)
			{
				let slider = $('.blog_slider');
				let item_count;
				let item_index;
				let page_size;
				
				let prev = slider.siblings('.slider_nav_btn_prev');
				let next = slider.siblings('.slider_nav_btn_next');
	
				slider.owlCarousel(
				{
					loop:false,
					margin:24,
					nav:false,
					dots: false,
					responsive:
					{
						0:{
							items:1
						},
						768:{
							items:2
						},
						1200:{
							items:3
						}
					},
					onInitialized: on_change,
					onChanged: on_change
				});
	
				function on_change(event)
				{
					item_count = event.item.count;
					page_size = event.page.size;
					item_index = event.item.index + 1;
	
					// Show "back" button when you slide forward at least once
					if(item_index > 1)
					{
						prev.removeClass('disabled');
					}
					else
					{
						prev.addClass('disabled');
					}
	
					// Hide "next" navigation button when there's no more slides to show
					if(item_index === (item_count - page_size + 1) || item_count < page_size)
					{
						next.addClass('disabled');
					}
					else
					{
						next.removeClass('disabled');
					}
				}
	
				// Slider navigation buttons
				if(prev.length)
					{
						prev.on('click', function()
						{
							slider.trigger('prev.owl.carousel');
						});
					}
	
				if(next.length)
				{
					next.on('click', function()
					{
						slider.trigger('next.owl.carousel');
					});
				}
			}
	}

});