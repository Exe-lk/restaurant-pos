import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../components/bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Label from '../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../common/data/enumPaymentMethod';
import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
	addDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { firestore, auth, storage } from '../../firebaseConfig';
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	uploadBytesResumable,
} from 'firebase/storage';
import moment from 'moment';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from '../../components/bootstrap/forms/Select';

// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	//image upload
	const handleUploadimage = async () => {
		if (imageurl) {
			// Assuming generatePDF returns a Promise
			const pdfFile = imageurl;
			console.log(imageurl);
			const storageRef = ref(storage, `foods/${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								console.log('File uploaded successfully. URL:', url);

								console.log(url);
								resolve(url); // Resolve the Promise with the URL
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					},
				);
			});
		} else {
			return '';
		}
	};

	// Initialize formik for form management
	const formik = useFormik({
		initialValues: {
			name: '',
			category: '',
			price: '',
			imageurl: null,
			volume: '',
		},
		validate: (values) => {
			const errors: {
				name?: string;
			} = {};
			if (!values.name) {
				errors.name = 'Required';
			}

			return errors;
		},
		onSubmit: async (values) => {
			try {
				const processingPopup = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});

				const imgurl: any = await handleUploadimage();

				values.imageurl = (await imgurl) || '';

				console.log(values);
				const collectionRef = collection(firestore, 'liquor');

				addDoc(collectionRef, values)
					.then(() => {
						setIsOpen(false);

						Swal.fire('Added!', 'Item has been add successfully.', 'success');
					})
					.catch((error) => {
						console.error('Error adding document: ', error);
						alert(
							'An error occurred while adding the document. Please try again later.',
						);
					});
			} catch (error) {
				Swal.fire('Network Error', 'Please try again later', 'error');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'New  Liquor'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				{selectedImage && (
					<img
						src={selectedImage}
						className='mx-auto d-block mb-4'
						alt='Selected Profile Picture'
						style={{ width: '150px', height: '150px' }}
					/>
				)}

				{/* Form fields for customer information */}
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
					<FormGroup id='category' label='Category' className='col-md-6'>
						<Input
							required
							onChange={formik.handleChange}
							value={formik.values.category}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.category}
							invalidFeedback={formik.errors.category}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='volume' label='Volume' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.volume}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.volume}
							invalidFeedback={formik.errors.volume}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='price' label='Price' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.price}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.price}
							invalidFeedback={formik.errors.price}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup label='Item Picture' className='col-md-6'>
						<Input
							type='file'
							onChange={(e: any) => {
								setImageurl(e.target.files[0]);
								// Display the selected image
								setSelectedImage(URL.createObjectURL(e.target.files[0]));
							}}
						/>
					</FormGroup>
				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit}>
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
};
// If 'id' is not present, return null (modal won't be rendered)

// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;
