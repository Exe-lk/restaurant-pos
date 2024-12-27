import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useFormik } from 'formik';
import useDarkMode from '../../../hooks/useDarkMode';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import { demoPagesMenu } from '../../../menu';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import CustomerEditModal from '../../../components/custom/UserAddModal';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import moment from 'moment';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import COLORS from '../../../common/data/enumColors';
import { getFirstLetter } from '../../../helpers/helpers';
import Swal from 'sweetalert2';
import data from '../../../common/data/dummyCustomerData';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import Dropdown, { DropdownToggle, DropdownMenu } from '../../../components/bootstrap/Dropdown';
import Popovers from '../../../components/bootstrap/Popovers';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import { string } from 'prop-types';




interface Employee {
  balance: number;
  id: string;
  cid: string;
  name: string;
  email: string;
  type: string;
  salary: number
  NIC: string;
  designation: string;
  membershipDate: moment.Moment;
}




const Index: NextPage = () => {

  // Dark mode
  const { darkModeStatus } = useDarkMode();
  //store search feild data
  const [searchTerm, setSearchTerm] = useState("");
  //filter data
  const [fulltime, setFulltime] = useState<boolean>(true);
  const [parttime, setParttime] = useState<boolean>(true);
  // State for current page and items per page
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);
  // get last user id
  const [id, setId] = useState<any>();

  const [editModalStatus, setEditModalStatus] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT['5']);



  // Formik form for search and filter
  const formik = useFormik({
    initialValues: {
      searchInput: '',
      type: [],
    },
    onSubmit: () => {
      // alert(JSON.stringify(values, null, 2));
    },
  });


  const [employeeData, setEmployeeData] = useState<Employee[]>([]);

  // useEffect(() => {
  const fetchData = async () => {
    try {
      const dataCollection = collection(firestore, 'employees');
      const querySnapshot = await getDocs(dataCollection);
      const firebaseData = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Employee;
        return {

          ...data,
          membershipDate: moment(data.membershipDate),
          cid: doc.id,
        };
      });


      setEmployeeData(firebaseData);
      await new Promise(resolve => setTimeout(resolve, 10000));
      setId(employeeData.length + 1)

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  fetchData();
  // }, []);

  const { items, requestSort, getClassNamesFor } = useSortableData(employeeData);

  useEffect(() => {
    setId(employeeData.length + 1)
  }, [employeeData]);

  const handleClickDelete = async (id: string) => {
    console.log(id)
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this employee!',
        // text: id,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const docRef = doc(firestore, 'employees', id);
        await deleteDoc(docRef);

        // Show success message
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');

        // Refresh data after deletion
        const updatedDataCollection = await getDocs(collection(firestore, 'employees'));
        const updatedData = updatedDataCollection.docs.map((doc) => {
          const data = doc.data() as Employee;
          return {

            ...data,
            membershipDate: moment(data.membershipDate),
          };
        });

        setEmployeeData(updatedData);
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      // Handle error (e.g., show an error message)
      Swal.fire('Error', 'Failed to delete employee.', 'error');
    }



  };

  // filter
  const handlefulltimefilter = () => {
    if (fulltime == true) {
      setFulltime(false)

    } else {
      setFulltime(true)
    }


  }
  //filter parttime
  const handleparttimefilter = () => {

    if (parttime == true) {
      setParttime(false)
    }
    else {
      setParttime(true)
    }

  }
  return (
    <PageWrapper>
      <Head>
        <title>employee</title>
      </Head>
      <SubHeader>
        <SubHeaderLeft>
          {/* Search input */}
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search employee...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Dropdown>
            <DropdownToggle hasIcon={false}>
              <Button
                icon='FilterAlt'
                color='dark'
                isLight
                className='btn-only-icon position-relative'>

              </Button>
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size='lg'>
              <div className='container py-2'>
                <div className='row g-3'>

                  <FormGroup label='Employee type' className='col-12'>
                    <ChecksGroup>

                      {/* <input type="checkbox" value="ful-time" name='fulltime' id='fulltime' checked onClick={handlefilter}/>
                     <label htmlFor="" style={{padding:"8px"}}> full-time</label><br/>
                     <input type="checkbox" value="ful-time" name='fulltime'  id='parttime' checked onClick={handlefilter}  />
                     <label htmlFor="" style={{padding:"8px"}}> part-time</label> */}
                      <Checks
                        key="full-time"
                        id="full-time"
                        label="full-time"
                        name='full-time'
                        value="full-time"

                        onClick={handlefulltimefilter}
                        checked={fulltime}
                      />

                      <Checks
                        key="part-time"
                        id="part-time"
                        label="part-time"
                        name='part-time'
                        value="part-time"

                        onClick={handleparttimefilter}
                        checked={parttime}

                      />

                    </ChecksGroup>
                  </FormGroup>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
          <SubheaderSeparator />
          {/* Button to open new employee modal */}
          <Button icon='PersonAdd' color='primary' isLight onClick={() => setEditModalStatus(true)}>
            New Employee
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch>
              <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Started Date</th>
                      <th>Salary or Allowance</th>
                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {dataPagination(
                      employeeData.filter((val) => {
                        if (searchTerm === "") {
                          if (fulltime == true && parttime == true) {
                            return val;
                          } else if (parttime == true && fulltime == false) {
                            return val.type.toLowerCase().includes('part-time');
                          } else if (parttime == false && fulltime == true) {
                            return val.type.toLowerCase().includes('full-time');
                          }
                        } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                          if (fulltime == true && parttime == true) {
                            return val;
                          } else if (parttime == true && fulltime == false) {
                            return val.type.toLowerCase().includes('part-time');
                          } else if (parttime == false && fulltime == true) {
                            return val.type.toLowerCase().includes('full-time');
                          }
                        }
                      }),
                      currentPage,
                      perPage
                    ).map((employee,index) => (
                      <tr key={employee.id}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='flex-shrink-0'>
                              <div className='ratio ratio-1x1 me-3' style={{ width: 48 }}>
                                <div
                                  className={`bg-l${darkModeStatus ? 'o25' : '25'}-${getColorNameWithIndex(
                                    Number(employee.NIC),
                                  )} text-${getColorNameWithIndex(index)} rounded-2 d-flex align-items-center justify-content-center`}>
                                  <span className='fw-bold'>{getFirstLetter(employee.name)}</span>
                                </div>
                              </div>
                            </div>
                            <div className='flex-grow-1'>
                              <div className='fs-6 fw-bold'>{employee.name}</div>
                              <div className='text-muted'>
                                <Icon icon='Label' /> <small>{employee.type}</small>
                              </div>
                              <div className='text-muted'>
                                <Icon icon='Label' /> <small>{employee.designation}</small>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Button
                            isLink
                            color='light'
                            icon='Email'
                            className='text-lowercase'
                            tag='a'
                            href={`mailto:${employee.email}`}>
                            {employee.email}
                          </Button>
                        </td>
                        <td>
                          <div>{employee.membershipDate.format('ll')}</div>
                          <div>
                            <small className='text-muted'>{employee.membershipDate.fromNow()}</small>
                          </div>
                        </td>
                        <td>{employee.salary}</td>
                        <td>
                          <Button
                            icon='Visibility'
                            tag='a'
                            href={`/admin/crm/${employee.NIC}`}>
                            View
                          </Button>
                          <Button
                            icon='Delete'
                            isLight
                            onClick={() => handleClickDelete(employee.cid)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tbody>
                    {/* {dataPagination(items, currentPage, perPage).map((i) => (
      
     
   ))} */}
                  </tbody>

                </table>


              </CardBody>
            
              <PaginationButtons
                data={items}
                label='items'
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>
      <CustomerEditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id="" />
    </PageWrapper>
  );
};



export default Index;



