export default function ItemModal() {
  return (
<>
  <div className="modal" id="itemModal">
    <div className="modal-card">
      <div className="modal-head">
        <div><h3 id="itemModalTitle">New menu item</h3><p>Changes go live on the site immediately.</p></div>
        <button className="icon-btn" data-close="itemModal" aria-label="Close">✕</button>
      </div>
      <form className="form-grid" id="itemForm">
        <input type="hidden" name="id" />
        <div className="field"><label>Name</label><input name="name" required maxLength={140} placeholder="e.g. Al Pastor Tacos" /></div>
        <div className="field"><label>Description</label><textarea name="description" maxLength={400} placeholder="What is in it?" defaultValue={""} /></div>
        <div className="row">
          <div className="field"><label>Price (Rs)</label><input name="price" type="number" min={0} step={1} required placeholder={950} /></div>
          <div className="field"><label>Category</label><select name="category" id="itemCategory" required /></div>
        </div>
        <div className="row">
          <div className="field"><label>Image path</label><input name="image" placeholder="/assets/cat-mexican.jpg" /></div>
          <div className="field"><label>Tags</label><input name="tags" placeholder="veg, spicy, popular" /></div>
        </div>
        <label className="switch"><input type="checkbox" name="available" defaultChecked /><span className="track" /> Available to order</label>
        <div className="form-foot">
          <button type="button" className="btn btn--ghost" data-close="itemModal">Cancel</button>
          <button type="submit" className="btn btn--red" id="itemSaveBtn">Save item</button>
        </div>
      </form>
    </div>
  </div>
</>
  );
}
