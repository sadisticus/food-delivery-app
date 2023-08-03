import {
  getStores,
  reset as resetStores,
} from "../features/stores/storesSlice";
import {
  getPartners,
  clearPartners,
  verifyPartner,
  reset as resetPartners,
} from "../features/partners/partnersSlice";
import {
  getOrders,
  clearOrders,
  reset as resetOrders,
} from "../features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useEffect } from "react";
import { PartnerStatus, StateStatus } from "../interfaces/enums";
import { toast } from "react-toastify";
import { PartnerTable } from "../components/PartnerTable";
import { Col, Row } from "react-bootstrap";
import { PartnerState } from "../interfaces/partner";
import { StoreTable } from "../components/StoreTable";
import { OrderHistory } from "../components/OrderHistory";

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    stores,
    status: storesStatus,
    message: storesMessage,
  } = useAppSelector((state) => state.stores);
  const {
    partners,
    status: partnersStatus,
    message: partnersMessage,
  } = useAppSelector((state) => state.partners);
  const {
    orders,
    status: ordersStatus,
    message: ordersMessage,
  } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(getStores(null));
      dispatch(getPartners());
      dispatch(getOrders());
    }

    return () => {
      dispatch(resetStores());
      dispatch(clearPartners());
      dispatch(clearOrders());
    };
  }, []);

  useEffect(() => {
    if (storesStatus == StateStatus.Error) {
      toast.error(storesMessage);
    }

    return () => {
      dispatch(resetStores());
    };
  }, [storesStatus, storesMessage]);

  useEffect(() => {
    if (partnersStatus == StateStatus.Error) {
      toast.error(partnersMessage);
    }

    return () => {
      dispatch(resetPartners());
    };
  }, [partnersStatus, partnersMessage]);

  useEffect(() => {
    if (ordersStatus == StateStatus.Error) {
      toast.error(ordersMessage);
    }

    return () => {
      dispatch(resetOrders());
    };
  }, [ordersStatus, ordersMessage]);

  const handleVerify = (partner: PartnerState, status: PartnerStatus) => {
    if (partner.status === status) {
      toast.warn(`Partner is already ${PartnerStatus[status]}`);
    } else {
      dispatch(verifyPartner({ partnerId: partner.id, newStatus: status }));
    }
  };

  return (
    <Row>
      <Col>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="text-center mt-3 mb-3">Partners</h1>
        </div>

        {partners.length > 0 ? (
          <PartnerTable partners={partners} onVerify={handleVerify} />
        ) : (
          <p className="text-center mt-4">
            There are currently no registered partners
          </p>
        )}
      </Col>

      <hr />

      <Col>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="text-center mt-3 mb-3">Registered Stores</h1>
        </div>
        {partners.length > 0 ? (
          <StoreTable stores={stores} />
        ) : (
          <p className="text-center mt-4">
            There are currently no registered stores
          </p>
        )}
      </Col>

      <hr />

      <Col>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="text-center mt-3 mb-3">Orders</h1>
        </div>
        {partners.length > 0 ? (
          <OrderHistory orders={orders} canManageOrders={false} />
        ) : (
          <p className="text-center mt-4">
            There are currently no registered partners
          </p>
        )}
      </Col>
    </Row>
  );
}