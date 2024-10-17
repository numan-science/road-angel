import React, { useEffect, useState } from "react";
import _ from "lodash";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import {
  getInsuranceCompany,
  getInsuranceCompanies,
} from "@/services/insurance-company";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import CompanyUserList from "./list";
import { useTranslation } from "react-i18next";
import { Notification } from "@/components/ui";
import { getRoles } from "@/services/role";

const insuranceCompany = () => {
  const { t } = useTranslation();
  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roles, setRoles] = useState([]);
  const [InsuranceCompany, setInsuranceCompany] = useState(null);
  useEffect(() => {
    getInsuranceCompanyData(page, limit);
    getRolesData();
    // companyFilter();
  }, []);

  const getInsuranceCompanyData = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getInsuranceCompany(options);
	  setInsuranceCompanyList(response.data.rows);
      setCount(response.data.count);
	  const data = _.map(response?.data?.rows, (row) => ({
        value: row.name,
        label: row.name,
      }));
      setFilterList(data);
      setLimit(limit);
      setPage(page);
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>
      );
    }
    setLoading(false);
  };

//   const companyFilter = async () => {
//     setLoading(true);
//     try {
//       const response = await getInsuranceCompanies();
//       const data = _.map(response?.data?.rows, (row) => ({
//         value: row.name,
//         label: row.name,
//       }));
//       setFilterList(data);
//       console.log("data", data);
//       console.log("response", response);
//     } catch (error) {
//       toast.push(
//         <Notification className="mb-4" type="danger">
//           {error?.response?.data.message}
//         </Notification>
//       );
//     }
//     setLoading(false);
//   };
  const getRolesData = async (options = {}) => {
    setLoading(true);
    try {
      const response = await getRoles(options);
      const data = _.map(response.data, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setRoles(data);
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>
      );
    }
    setLoading(false);
  };

  // const [attachments, setAttachments] = useState([]);

  // const handleFileUpload = async (files) => {

  //   for (let i = 0; i < files.length; i++) {
  // 	const file = files[i];
  // 	try {
  // 	  const response = await uploadFile(file);
  // 	  attachments.push({
  // 		url: response.data.name,
  // 		type: _.first(file?.type?.split("/")) === "image" ? "photos" : "videos",
  // 		postType: selectedPostType,
  // 	  });
  // 	} catch (error) {
  // 	  toast.push(
  // 		<Notification className="mb-4" type="danger">
  // 		  {error?.response?.data.message}
  // 		</Notification>
  // 	  );
  // 	}
  //   }
  //   setAttachments([...attachments]);
  // };

  const addNewPost = () => {
    setVisible(true);
  };

  const onDialogClose = () => {
    setInsuranceCompany(null);
    setTimeout(() => {
      setIsEdit(false);
    }, 700);
    setVisible(false);
    getInsuranceCompanyData(page, limit);
  };

  const handleEditInsuranceCompany = (InsuranceCompany) => {
    setIsEdit(true);
    setVisible(true);
    setInsuranceCompany(InsuranceCompany);
  };

  // const handleFileRemove = (url) => {
  // 	setState(
  // 		"attachments",
  // 		_.filter(state?.attachments, (attch) => attch.url !== url)
  // 	);
  // };

  return (
    <Container>
      <UserForm
        open={visible}
        onClose={onDialogClose}
        isEdit={isEdit}
        data={InsuranceCompany}
        roles={roles}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h3>{t("heading.Insurance Company")}</h3>
          <div className="flex items-center gap-2">
            <AuthorityCheck authority={["can_add_insurance_company"]}>
              <Button
                size="sm"
                icon={<HiOutlinePlusCircle />}
                onClick={addNewPost}
              >
                {t("button.Add New")}
              </Button>
            </AuthorityCheck>
          </div>
        </div>
        <Filters
          getTableData={getInsuranceCompanyData}
          filterList={filterList}
        />
      </div>
      <Container className="p-4">
        <CompanyUserList
          data={insuranceCompanyList}
          count={count}
          page={page}
          limit={limit}
          getTableData={getInsuranceCompanyData}
          loading={loading}
          handleEditClick={handleEditInsuranceCompany}
        />
      </Container>
    </Container>
  );
};

export default insuranceCompany;
