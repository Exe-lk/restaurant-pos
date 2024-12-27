import React, { FC, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import Swal from 'sweetalert2';

interface UserAddModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

const UserAddModal: FC<UserAddModalProps> = ({ id, isOpen, setIsOpen }) => {
	const formik = useFormik({
		initialValues: {
			name: '',

			email: '',
			address: '',
			mobileNumber: '',
			status: true,
		},
		validate: (values) => {
			const errors: {
				name?: string;
				email?: string;
				address?: string;
				mobileNumber?: string;
				item?: string[];
			} = {};
			if (!values.name) {
				errors.name = 'Name is required.';
			}
			if (!values.email) {
				errors.email = 'Required';
			} else if (!values.email.includes('@')) {
				errors.email = 'Invalid email format.';
			} else if (values.email.includes(' ')) {
				errors.email = 'Email should not contain spaces.';
			} else if (/[A-Z]/.test(values.email)) {
				errors.email = 'Email should be in lowercase only.';
			}
			if (!values.address) {
				errors.address = 'Address is required.';
			}
			if (!values.mobileNumber) {
				errors.mobileNumber = 'Mobile number is required.';
			} else if (values.mobileNumber.length < 10) {
				errors.mobileNumber = 'Mobile number must be at least 10 characters.';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				const process = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				try {
					const collectionRef = collection(firestore, 'costomer');
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
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	const formatMobileNumber = (value: string) => {
		let sanitized = value.replace(/\D/g, '');
		if (!sanitized.startsWith('0')) sanitized = '0' + sanitized;
		return sanitized.slice(0, 10);
	};

	return (
		<Modal isOpen={isOpen} aria-hidden={!isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader
				setIsOpen={() => {
					setIsOpen(false);
					formik.resetForm();
				}}
				className='p-4'>
				<ModalTitle id=''>{'New Dealer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
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

					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							type='email'
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='address' label='Address' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.address}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.address}
							invalidFeedback={formik.errors.address}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='mobileNumber' label='Mobile number' className='col-md-6'>
						<Input
							type='text'
							value={formik.values.mobileNumber}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const input = e.target.value.replace(/\D/g, '');
								formik.setFieldValue('mobileNumber', formatMobileNumber(input));
							}}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.mobileNumber}
							invalidFeedback={formik.errors.mobileNumber}
							validFeedback='Looks good!'
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='success' onClick={formik.handleSubmit}>
					Create Dealer
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
