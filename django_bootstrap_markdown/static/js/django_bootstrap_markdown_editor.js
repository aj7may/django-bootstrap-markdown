$.fn.extend({
	markdown_preview: function(options) {
		var defaults = {
			tabString: '       '
		};
		var opts = $.extend(defaults, options);
		this.each(function() {
			var $this = $(this);
			var $textarea = $this.find('textarea');
			var $preview = $this.find('.preview');
			var $image_button = $this.find('.markdown-image-btn');
			var update = function() {
				$preview.html(marked($textarea.val()));
			};
			$textarea.tabby({tabString: opts.tabString});
			$textarea.on('scroll', function(e) {
				var percent = $this.scrollTop() / ( $textarea.scrollHeight-$textarea.height() );
				$preview.scrollTop( ($preview.scrollHeight - $preview.height()) * percent );
			});
			$image_button.click(function() {
				window.markdown_textarea = $(this).parent().parent().find('textarea');
				window.markdown_cursor_pos = $(window.markdown_textarea).prop('selectionStart');
				window.open('/markdown/image/');
			});
			$textarea.on('keyup change', update);
			update();
		});
	}
});

// using it
$(document).ready(function() {
	$('.md-edit').markdown_preview();
});

// callback function
window.markdown_image_callback = function(sized, original, alt) {
    var v = $(window.markdown_textarea).val();
    var textBefore = v.substring(0, window.markdown_cursor_pos);
    var textAfter  = v.substring(window.markdown_cursor_pos, v.length);
    $(window.markdown_textarea).val( textBefore+ "[!["+alt+"]("+sized+")]("+original+")" +textAfter );
    $(window.markdown_textarea).keyup();
}