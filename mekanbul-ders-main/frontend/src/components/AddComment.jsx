import React, { useState } from "react"; // useState'i React'ten import ettik
import Header from "./Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VenueDataService from "../services/VenueDataService";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal"; // Modal bileşenini doğru şekilde import edin

function AddComment() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false); // useState tanımlandı
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/venue/${id}`);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();

    // Form elemanlarının doldurulduğunu kontrol ediyoruz
    const { author, rating, text } = evt.target.elements;
    if (author.value && rating.value && text.value) {
      const newComment = {
        author: author.value,
        rating: rating.value,
        text: text.value,
      };

      // VenueDataService ile yeni yorumu ekliyoruz
      VenueDataService.addComment(id, newComment)
        .then(() => {
          dispatch({ type: "ADD_COMMENT_SUCCESS" }); // Redux aksiyonu
          setShowModal(true); // Modal'ı açıyoruz
        })
        .catch(() => {
          dispatch({ type: "ADD_COMMENT_FAILURE" }); // Redux başarısız aksiyonu
        });
    }
  };

  return (
    <>
      <Header headerText={location.state.name} motto=" mekanına yorum yap" />
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <form
            className="form-horizontal"
            id="yorumEkle"
            onSubmit={(evt) => onSubmit(evt)}
          >
            <div className="form-group">
              <label className="col-sm-2 control-label">İsim:</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="author" />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-10 col-sm-2 control-label">Puan:</label>
              <div className="col-xs-12 col-sm-2">
                <select
                  className="form-control input-sm"
                  id="rating"
                  name="rating"
                >
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Yorum:</label>
              <div className="col-sm-10">
                <textarea
                  className="review form-control"
                  name="text"
                  rows={5}
                />
              </div>
            </div>
            <button className="btn btn-default pull-right">Yorum Ekle</button>
          </form>

          {/* Modal bileşeni */}
          <Modal
            show={showModal}
            onClose={handleModalClose}
            title="Tebrikler!"
            message="Yorumunuz yayınlandı!"
          />
        </div>
      </div>
    </>
  );
}

export default AddComment;
