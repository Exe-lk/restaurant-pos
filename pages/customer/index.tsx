import { addDoc, collection } from 'firebase/firestore';
import { useFormik } from 'formik';
import React from 'react';
import Swal from 'sweetalert2';
import { firestore } from '../../firebaseConfig';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import { useRouter } from 'next/router';
import img1 from '../../assets/img/pizza.png';
import img2 from '../../assets/img/plogo.png';
const index = () => {
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			name: '',
			contact: '',
			email: '',
			tableNo: '',
		},
		validate: (values) => {
			const errors: {
				name?: string;
				contact?: string;
				email?: string;
				tableNo?: string;
			} = {};
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.contact) {
				errors.contact = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.tableNo) {
				errors.tableNo = 'Required';
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

				const collectionRef = collection(firestore, 'coustomer');
				localStorage.setItem('table', values.tableNo);
				addDoc(collectionRef, values)
					.then(() => {
						Swal.close();
						router.push('/customer/menu');
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
		<div
			className='container-fluid bg-dark text-light d-flex justify-content-center  min-vh-100 position-relative'
			style={{
				backgroundImage: `url(${img1})`,
				backgroundPosition: 'bottom left',
				backgroundRepeat: 'no-repeat',
				backgroundSize: '400px auto', // Adjust the size of the image
			}}>
			<div className='row w-100'>
				<div className='col-md-6 mx-auto'>
					<img
						src={img2}
						className='img-fluid'
						alt={'img'}
						style={{
							margin: 10,
							objectFit: 'cover',
							width: '100%',
							height: '150px',
							marginBottom: 40,
						}}
					/>
					<FormGroup id='name' label='Name' className='mb-3'>
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
					<FormGroup id='contact' label='Contact No' className='mb-3'>
						<Input
							required
							onChange={formik.handleChange}
							value={formik.values.contact}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.contact}
							invalidFeedback={formik.errors.contact}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='mb-3'>
						<Input
							required
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
					<FormGroup id='tableNo' label='Table No' className='mb-3'>
						<Input
							required
							onChange={formik.handleChange}
							value={formik.values.tableNo}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.tableNo}
							invalidFeedback={formik.errors.tableNo}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<div className='d-flex w-60 justify-content-center'>
						<Button
							color='success'
							onClick={formik.handleSubmit}
							style={{
								marginTop:10,
								backgroundColor: '#f75205', // Change background color to orange
								width: '200px', // Increase the width
								borderRadius: 50, // Adjust border radius
								border: 'none', // Remove the default border
							}}>
							NEXT
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default index;
