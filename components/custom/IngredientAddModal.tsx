import React, { FC} from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import Select from '../bootstrap/forms/Select';
import Option, { Options } from '../bootstrap/Option';

interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {


	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: '',
			quantity:0,
			category:''
			
		},
		validate: (values) => {
			const errors: {
				name?: string;
				category?:string
			
			} = {};
			
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.category) {
				errors.category = 'Required';
			}
			
			return errors;
		},
		onSubmit: async (values) => {
			try {
				Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				try {
					const collectionRef = collection(firestore, 'ingredient');
					addDoc(collectionRef, values)
						.then(() => {
							setIsOpen(false);
							formik.resetForm();
							Swal.fire('Added!', 'Employee has been add successfully.', 'success');
						})
						.catch((error) => {
							console.error('Error adding document: ', error);
							alert(
								'An error occurred while adding the document. Please try again later.',
							);
						});
					
				} catch (error) {
					await Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Failed to add the dealer. Please try again.',
					});
				}
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				Swal.close;
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});
	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
				<ModalTitle id=''>{'New Ingredient'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label=' Ingrdient Name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='category' label='Category' className='col-md-6'>
						<Select
							ariaLabel='Default select example'
							placeholder='Open this select category'
							onChange={formik.handleChange}
							value={formik.values.category}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.category}
							invalidFeedback={formik.errors.category}
							validFeedback='Looks good!'>
							
								<Option value="vegetables">vegetables</Option>
								<Option value="meats">meats</Option>
								<Option value="Goods">Goods</Option>
								<Option value="raw materials">raw materials</Option>
							

							
						</Select>
					</FormGroup>
					
					
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};

UserAddModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserAddModal;
