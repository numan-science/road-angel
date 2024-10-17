import React, { useEffect, useState } from "react";
import _ from "lodash";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import LeasingInsuranceCompanyList from "./list";
import { useTranslation } from "react-i18next";
import { Notification } from "@/components/ui";
import { getRoles } from "@/services/role";
import { getLeasingCompany } from "@/services/leasingCompanies";

const LeasingCompany = () => {
  const { t } = useTranslation();
  const [leasingCompanyList, setLeasingCompanyList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roles, setRoles] = useState([]);
  const [leasingCompanies, setLeasingCompanies] = useState(null);
  useEffect(() => {
    getLeasingInsuranceCompanyData(page, limit);
    getRolesData();
  }, []);
  const getLeasingInsuranceCompanyData = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getLeasingCompany(options);
      setLeasingCompanyList(response.data.rows);
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

  const addNewPost = () => {
    setVisible(true);
  };

  const onDialogClose = () => {
    setLeasingCompanies(null);
    setTimeout(() => {
      setIsEdit(false);
    }, 700);
    setVisible(false);
    getLeasingInsuranceCompanyData(page, limit);
  };

  const handleEditLeasingInsuranceCompany = (leasingCompanies) => {
    setIsEdit(true);
    setVisible(true);
    setLeasingCompanies(leasingCompanies);
  };

  return (
    <Container>
      <UserForm
        open={visible}
        onClose={onDialogClose}
        isEdit={isEdit}
        data={leasingCompanies}
        roles={roles}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h3>{t("heading.Leasing Insurance Company")}</h3>
          <div className="flex items-center gap-2">
            <AuthorityCheck authority={["can_add_leasing_insurance_company"]}>
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
          getTableData={getLeasingInsuranceCompanyData}
          filterList={filterList}
        />
      </div>
      <Container className="p-4">
        <LeasingInsuranceCompanyList
          data={leasingCompanyList}
          count={count}
          page={page}
          limit={limit}
          getTableData={getLeasingInsuranceCompanyData}
          loading={loading}
          handleEditClick={handleEditLeasingInsuranceCompany}
        />
      </Container>
    </Container>
  );
};

export default LeasingCompany;
