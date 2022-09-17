<?php
class MFN_Options_tabs extends Mfn_Options_field
{

	/**
	 * Render
	 */

	public function render( $existing = false, $vb = false, $js = false )
	{

		$field_prefix = '';
		$preview = '';
		$primary = 'title';

		// name

		$name	= $this->field['id'];

		if ( 'new' == $existing ) {
			$field_prefix = 'data-';
		}

		// visual builder

		if( $js ){
			$name = $existing;
		}

		// preview

		if ( ! empty( $this->field['preview'] ) ){
			$preview = 'preview-'. $this->field['preview'];
		}

		// primary

		if( isset( $this->field['primary'] ) ){
			$primary = $this->field['primary'];
		}

		if( empty( $this->field['options'][$primary][2] ) ){
			$this->field['options'][$primary][2] = '';
		}

		// output -----

		if( empty( $this->field['options'] ) ){
			echo 'please enter default fields';
			return false;
		}

		echo '<div class="form-group tabs mfn-form-verical">';

			echo '<ul class="tabs-wrapper '. esc_attr( $preview ) .'">';

				echo '<li class="tab default">';

					echo '<div class="tab-header">';

						echo '<a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-show" href="#"><span class="mfn-icon mfn-icon-arrow-down"></span></a>';
						echo '<a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-hide" href="#"><span class="mfn-icon mfn-icon-arrow-up"></span></a>';

            echo '<h6 class="title">'. esc_html( $this->field['options'][$primary][2] ) .'</h6>';
						echo '<a class="mfn-option-btn mfn-option-blue mfn-tab-clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a>';
						echo '<a class="mfn-option-btn mfn-option-blue mfn-tab-delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a>';

					echo '</div>';

					echo '<div class="tab-content">';

						foreach( $this->field['options'] as $label => $param ){

							// visual builder
							if( $js ){
								$field_name = $name .'[0]['. $label .']';
							}else{
								$field_name = $name .'['. $label .'][]';
							}

							$jsc = false;
							if( $primary == $label ){
								$jsc = 'js-title';
							}

							echo '<div class="form-control">';
								echo '<label class="form-label">'. esc_html( $param[1] ) .'</label>';

								if( 'input' == $param[0] ){
									echo '<input data-order="0" data-label="'.$label.'" class="not-empty field-to-object mfn-form-control mfn-form-input mfn-tab-'. esc_attr($label) .' '. esc_attr($jsc) .'" type="text" data-default="'. esc_attr( $field_name ) .'" value="'. esc_html( $param[2] ) .'"/>';
								} else if ( 'textarea' == $param[0] ){
									echo '<textarea data-order="0" data-label="'.$label.'" class="not-empty field-to-object mfn-form-control mfn-form-textarea" rows="3" data-default="'. esc_attr( $field_name ) .'">'. esc_textarea( $param[2] ) .'</textarea>';
								}

							echo '</div>';

						}

					echo '</div>';

				echo '</li>';

				if( $js ){
					$looped_html = '';
					foreach( $this->field['options'] as $label => $param ){
						if( empty( $value[$label] ) ) $value[$label] = '';
						$jsc = false;
						if( $primary == $label ) $jsc = 'js-title';

						$looped_html .= '<div class="form-control"><label class="form-label">'. esc_html( $param[1] ) .'</label>';


						if( 'input' == $param[0] ){
							$looped_html .= '<input data-order="\'+i+\'" data-label="'.$label.'" type="text" class="not-empty field-to-object mfn-form-control mfn-form-input mfn-tab-'. esc_attr( $label ) .' '. esc_attr($jsc) .'" '. esc_attr( $field_prefix ) .'name="'. $name .'[\'+i+\']['. $label .']' .'" value="\'+v.'.$label.'+\'"/>';
						} else if ( 'textarea' == $param[0] ){
							$looped_html .= '<textarea data-order="\'+i+\'" data-label="'.$label.'" class="not-empty field-to-object mfn-form-control mfn-form-textarea" rows="3" '. esc_attr( $field_prefix ) .'name="'. $name .'[\'+i+\']['. $label .']' .'">\'+v.'.$label.'+\'</textarea>';
						}

						$looped_html .= '</div>';
					}

					echo '\' + ('.$js.' && '.$js.'.length ? '.$js.'.map((v, i) => \'<li class="tab"><div class="tab-header"><a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-show" href="#"><span class="mfn-icon mfn-icon-arrow-down"></span></a><a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-hide" href="#"><span class="mfn-icon mfn-icon-arrow-up"></span></a><h6 class="title">\'+(v.'.$primary.')+\'</h6><a class="mfn-option-btn mfn-option-blue mfn-tab-clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a><a class="mfn-option-btn mfn-option-blue mfn-tab-delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a></div><div class="tab-content">'.$looped_html.'</div></li>\' ).join("") : "") +\'';
				}else if ( ! empty( $this->value ) ){

					if ( is_array( $this->value ) ){

						// visual builder
						$l = 0;

						foreach ( $this->value as $k => $value ) {

							if( empty( $value[$primary] ) ){
								$value[$primary] = '';
							}

							echo '<li class="tab">';

								echo '<div class="tab-header">';

									echo '<a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-show" href="#"><span class="mfn-icon mfn-icon-arrow-down"></span></a>';
									echo '<a class="mfn-option-btn mfn-option-blank mfn-tab-toggle mfn-tab-hide" href="#"><span class="mfn-icon mfn-icon-arrow-up"></span></a>';

			            echo '<h6 class="title">'. esc_html( $value[$primary] ) .'</h6>';
									echo '<a class="mfn-option-btn mfn-option-blue mfn-tab-clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a>';
									echo '<a class="mfn-option-btn mfn-option-blue mfn-tab-delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a>';

								echo '</div>';

								echo '<div class="tab-content">';

									// visual builder


									foreach( $this->field['options'] as $label => $param ){

										// visual builder
										if( $js ){
											$field_name = $name .'['. $l .']['. $label .']';
										}else{
											$field_name = $name .'['. $label .'][]';
										}

										if( empty( $value[$label] ) ){
											$value[$label] = '';
										}

										$jsc = false;
										if( $primary == $label ){
											$jsc = 'js-title';
										}

										echo '<div class="form-control">';
											echo '<label class="form-label">'. esc_html( $param[1] ) .'</label>';

											if( 'input' == $param[0] ){
												echo '<input type="text" class="not-empty mfn-form-control mfn-form-input mfn-tab-'. esc_attr( $label ) .' '. esc_attr($jsc) .'" '. esc_attr( $field_prefix ) .'name="'. esc_attr( $field_name ) .'" value="'. esc_html( $value[$label] ) .'"/>';
											} else if ( 'textarea' == $param[0] ){
												echo '<textarea class="not-empty mfn-form-control mfn-form-textarea" rows="3" '. esc_attr( $field_prefix ) .'name="'. esc_attr( $field_name ) .'">'. esc_textarea( $value[$label] ) .'</textarea>';
											}

										echo '</div>';



									}

								echo '</div>';

							echo '</li>';

							// visual builder
							$l++;

						}

					}

				}



			echo '</ul>';

			echo '<a href="#" class="mfn-button-add">'. esc_html__( 'Add new', 'mfn-opts' ) .'</a>';

		echo '</div>';

		// visual builder

		if( ! $vb ){
			echo $this->get_description();
		}
	}

	/**
	 * Enqueue
	*/

	public function enqueue()
	{
		wp_enqueue_script( 'mfn-opts-field-tabs', MFN_OPTIONS_URI .'fields/tabs/field_tabs.js', array( 'jquery' ), MFN_THEME_VERSION, true );
	}
}
