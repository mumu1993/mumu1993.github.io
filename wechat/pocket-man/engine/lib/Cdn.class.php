<?php
class Cdn{
	public static $cdnHost = false;
	public static function init( $cdnHost ){
		self::$cdnHost = $cdnHost;
		ob_start();
	}
	public static function flush(){
		$html  = ob_get_clean();
		$regs['linkReg']['reg'] = '/<link\s*([^\r\n]+?)href=[\'\"](?!http:\/\/|https:\/\/)\/?(.+?)[\'\"]/is';
		$regs['linkReg']['replace'] = '<link ${1}href="http://'.self::$cdnHost.'/$2"';
		
		$regs['scriptReg']['reg'] = '/<script\s*([^\r\n]+?)src=[\'\"](?!http:\/\/|https:\/\/)\/?(.+?)[\'\"]/is';
		$regs['scriptReg']['replace'] = '<script $1src="http://'.self::$cdnHost.'/$2"';
		
		$regs['imgReg1']['reg'] = '/<img([^\r\n]+?)src=\'(?!http:\/\/|https:\/\/)\/?(.+?)\'/is';
		$regs['imgReg1']['replace'] = '<img${1}src=\'http://'.self::$cdnHost.'/$2\'';
		
		$regs['imgReg2']['reg'] = '/<img([^\r\n]+?)src="(?!http:\/\/|https:\/\/)\/?(.+?)"/is';
		$regs['imgReg2']['replace'] = '<img${1}src="http://'.self::$cdnHost.'/$2"';
		
		
		$regs['bgReg']['reg'] = '/background-image:(\s*?)url\([\'\"]?(?!http:\/\/|https:\/\/)\/?(.+?)[\'\"]?\)/is';
		$regs['bgReg']['replace'] = 'background-image:url( http://'.self::$cdnHost.'/$2 )';

		$regs['aReg1']['reg'] = '/<a[\s\r\n]*([^\r\n]*?)href=\'(?!http:\/\/|https:\/\/)\/?([^\r\n]+?)(\.jpg\'|\.png\'|\.gif\')/is';
		$regs['aReg1']['replace'] = '<a $1href=\'http://'.self::$cdnHost.'/$2';
		
		$regs['aReg2']['reg'] = '/<a[\s\r\n]*([^\r\n]*?)href="(?!http:\/\/|https:\/\/)\/?([^\r\n]+?)(\.jpg"|\.png"|\.gif")/is';
		$regs['aReg2']['replace'] = '<a $1href="http://'.self::$cdnHost.'/$2$3';

		foreach ($regs as $key => $value) {
			$html =  preg_replace($value['reg'], $value['replace'], $html);
		}
		echo $html;
	}
}
function cdnFlush(){
	Cdn::flush();
}
register_shutdown_function( 'cdnFlush' );