<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
if (!current_user_can('administrator')) die( 'No script kiddies please!' );
?><option>String (Text)</option>
<option>Date</option>
<option>Price</option>
<option>Alpha</option>
<option>Numeric (int)</option>
<option>Numeric (float)</option>
<option>Alphanumeric</option>
<option>URL Encode</option>
<option>Capitalize</option>
<option>UPPERCASE</option>
<option>lowercase</option>
<option>MD5 Hash</option>
<option>Base64 Encode</option>
<option>Base64 Decode</option>
<option>SHA1 Hash</option>
<option>Image Download</option>
