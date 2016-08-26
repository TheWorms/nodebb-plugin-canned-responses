"use strict";
/* globals bootbox, config */

$(document).ready(function() {
	var defaults;

	$.get(config.relative_path + '/canned-responses/defaults', function(data) {
		defaults = data;
	});

	
	$(window).on('action:composer.loaded', function(e, data) {
		require(['composer/controls'], function(controls) {
			var cid = parseInt(data.composerData.cid, 10);
			var textarea = $('#cmp-uuid-' + data.post_uuid + ' textarea');
			if (defaults[cid]) {
				controls.insertIntoTextarea(textarea, defaults[cid]);
			}	
		});
	});

	$(window).on('action:composer.enhanced', function() {
		require(['composer/formatting', 'composer/controls'], function(formatting, controls) {
			formatting.addButtonDispatch('canned-responses', function(textarea, selectionStart, selectionEnd) {
				$.get(RELATIVE_PATH + '/canned-responses').success(function(data) {
					data.hideControls = true;
	
					templates.parse('partials/canned-responses/list', data, function(html) {
						var insertIntoComposer = function(ev) {
								var responseText = submitEl.data('text');
								controls.insertIntoTextarea(textarea, responseText);
								controls.updateTextareaSelection(textarea, selectionStart, selectionStart + responseText.length);
							},
							modal = bootbox.dialog({
								title: 'Insert Canned Response',
								message: html,
								buttons: {
									insert: {
										label: 'Insert',
										className: 'btn-primary',
										callback: insertIntoComposer
									}
								}
							}),
							submitEl = modal.find('.btn-primary').attr('disabled', 'disabled');
	
						modal.find('.list-group').on('click', '.list-group-item', function() {
							var responseEl = $(this);
							responseEl.siblings().removeClass('active');
							responseEl.addClass('active');
	
							submitEl.data('text', ($(this).find('input[type="hidden"]').val()));
							submitEl.removeAttr('disabled');
						});
	
						// Go back to focusing on the textarea after modal closes (since that action steals focus)
						modal.on('hidden.bs.modal', function() {
							$(textarea).focus();
						});
					});
				});
			});
		});
	});
});
