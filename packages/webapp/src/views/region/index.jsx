import React, { useEffect, useState } from "react";
import _ from "lodash";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { getRegion } from "@/services/region";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import RegionLists from "./list";
import { useTranslation } from "react-i18next";

const Region = () => {
  const params = useParams();
  const { t } = useTranslation();
  const [RegionList, setRegionList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    getRegionData(page, limit);
  }, []);
  const getRegionData = async (page, limit, options = {}) => {
    setLoading(true);
    options.page = page;
    options.limit = limit;
    options = _.pickBy(options, _.identity);
    try {
      const response = await getRegion(options);

      setRegionList(response.data.rows);
      setCount(response.data.count);
      const data = _.map(response?.data?.rows, (row) => ({
        value: row.id,
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

  const addNewPost = () => {
    setVisible(true);
  };

  const onDialogClose = () => {
    setRegion(null);
    setTimeout(() => {
      setIsEdit(false);
    }, 700);
    setVisible(false);
    getRegionData(page, limit);
  };

  const handleEditRegion = (region) => {
    setIsEdit(true);
    setVisible(true);
    setRegion(region);
  };

  return (
    <Container>
      <UserForm
        open={visible}
        onClose={onDialogClose}
        isEdit={isEdit}
        data={region}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
          <h3>{t("heading.Region")}</h3>
          <div className="flex items-center gap-2">
            <AuthorityCheck authority={["can_add_region"]}>
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
          getTableData={getRegionData}
          filterList={filterList}
        />
      </div>
      <Container className="p-4">
        <RegionLists
          data={RegionList}
          count={count}
          page={page}
          limit={limit}
          getTableData={getRegionData}
          loading={loading}
          handleEditClick={handleEditRegion}
        />
      </Container>
    </Container>
  );
};

export default Region;
