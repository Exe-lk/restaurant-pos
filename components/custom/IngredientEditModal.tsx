import React, { FC, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Swal from 'sweetalert2';
import Select from '../bootstrap/forms/Select';
import Option from '../bootstrap/Option';
import { useGetUsersQuery, useUpdateUserMutation } from '../../redux/slices/userManagementApiSlice';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

interface UserEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
	
}

const UserEditModal: FC<UserEditModalProps> = ({ id, isOpen, setIsOpen }) => {
	
	const [userToEdit, setUsers] = useState<any>();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataCollection = collection(firestore, 'ingredient');
				const q = query(dataCollection, where('__name__', '==', id));
				const querySnapshot = await getDocs(q);
				const firebaseData = querySnapshot.docs.map((doc) => {
					const data = doc.data() as any;
					return {
						...data,
						cid: doc.id,
					};
				});

				await setUsers(firebaseData[0]);
				console.log(firebaseData);
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};

		fetchData();
	}, [id]);

	const formik = useFormik({
		initialValues: {
			id: '',
			name: userToEdit?.name || '',
			category:userToEdit?.category || ''
			
		},
		enableReinitialize: true,
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
							const data = {
								name: values.name,
								category:values.category
							};
		
							const docRef = doc(firestore, 'ingredient', id);
							// Update the data
		
							updateDoc(docRef, data)
								.then(() => {
									Swal.close();
									formik.resetForm();
									setIsOpen(false);
								})
								.catch((error) => {
									console.error('Error update document: ', error);
									alert(
										'An error occurred while adding the document. Please try again later.',
									);
								});
						} catch (error) {
							await Swal.fire({
								icon: 'error',
								title: 'Error',
								text: 'Failed to update the dealer. Please try again.',
							});
						}
					} catch (error) {
						console.error('Error during handleUpload: ', error);
						alert('An error occurred during file upload. Please try again later.');
					}
				},
			});

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={() => {
				setIsOpen(false);
				formik.resetForm();
			}}
			size='xl'
			titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id=''>{'Edit User'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
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

UserEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};
export default UserEditModal;
