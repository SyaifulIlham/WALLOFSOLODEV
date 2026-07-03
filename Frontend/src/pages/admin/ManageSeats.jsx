import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import AdminLayout from '../../layouts/AdminLayout';

// ── Validasi helper ────────────────────────────────────────────────────────────
const validateForm = (form, seats, editSeat) => {
    const errors = {};

    // Nomor kursi
    if (!form.nomor_kursi.trim()) {
        errors.nomor_kursi = 'Nomor kursi wajib diisi';
    } else if (!/^[A-Za-z]\d+$/.test(form.nomor_kursi.trim())) {
        errors.nomor_kursi = 'Format tidak valid. Contoh: A1, B10';
    } else if (form.baris && form.nomor_kursi.charAt(0).toUpperCase() !== form.baris.toUpperCase()) {
        errors.nomor_kursi = `Harus diawali huruf ${form.baris.toUpperCase()}`;
    } else {
        // Cek duplikat
        const isDuplicate = seats.some(s =>
            s.nomor_kursi.toUpperCase() === form.nomor_kursi.toUpperCase() &&
            (!editSeat || s.id_seat !== editSeat.id_seat)
        );
        if (isDuplicate) errors.nomor_kursi = `Kursi ${form.nomor_kursi.toUpperCase()} sudah ada`;
    }

    // Baris
    if (!form.baris.trim()) {
        errors.baris = 'Baris wajib diisi';
    } else if (!/^[A-Za-z]$/.test(form.baris.trim())) {
        errors.baris = 'Baris harus 1 huruf (A-Z)';
    }

    return errors;
};

const validateGenForm = (genForm) => {
    const errors = {};

    if (!genForm.baris_awal) {
        errors.baris_awal = 'Baris awal wajib diisi';
    } else if (!/^[A-Za-z]$/.test(genForm.baris_awal)) {
        errors.baris_awal = 'Harus 1 huruf (A-Z)';
    }

    if (!genForm.baris_akhir) {
        errors.baris_akhir = 'Baris akhir wajib diisi';
    } else if (!/^[A-Za-z]$/.test(genForm.baris_akhir)) {
        errors.baris_akhir = 'Harus 1 huruf (A-Z)';
    } else if (genForm.baris_awal && genForm.baris_akhir.toUpperCase() < genForm.baris_awal.toUpperCase()) {
        errors.baris_akhir = 'Harus sama atau lebih besar dari baris awal';
    }

    const jumlah = parseInt(genForm.jumlah_per_baris);
    if (!genForm.jumlah_per_baris) {
        errors.jumlah_per_baris = 'Jumlah wajib diisi';
    } else if (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
        errors.jumlah_per_baris = 'Jumlah harus antara 1–30';
    }

    return errors;
};

const ManageSeats = () => {
    const [seats, setSeats]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    // Modal tambah/edit
    const [showModal, setShowModal] = useState(false);
    const [editSeat, setEditSeat]   = useState(null);
    const [form, setForm]           = useState({ nomor_kursi: '', baris: '', status: 'tersedia' });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched]     = useState({});

    // Modal generate
    const [showGenerate, setShowGenerate] = useState(false);
    const [genForm, setGenForm]           = useState({ baris_awal: 'A', baris_akhir: 'E', jumlah_per_baris: 10 });
    const [genErrors, setGenErrors]       = useState({});
    const [genTouched, setGenTouched]     = useState({});

    const [toast, setToast] = useState(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchSeats = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/seats`);
            setSeats(res.data.data || []);
        } catch {
            showToast('Gagal memuat data kursi', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSeats(); }, []);

    // ── Toast ──────────────────────────────────────────────────────────────────
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Grid ───────────────────────────────────────────────────────────────────
    const seatsByRow = useMemo(() => {
        const map = {};
        seats.forEach(s => {
            if (!map[s.baris]) map[s.baris] = [];
            map[s.baris].push(s);
        });
        Object.keys(map).forEach(b => {
            map[b].sort((a, z) => {
                const na = parseInt(a.nomor_kursi.replace(/\D/g, ''));
                const nz = parseInt(z.nomor_kursi.replace(/\D/g, ''));
                return na - nz;
            });
        });
        return map;
    }, [seats]);

    const sortedRows = useMemo(() => Object.keys(seatsByRow).sort(), [seatsByRow]);

    // ── Form handlers ──────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditSeat(null);
        setForm({ nomor_kursi: '', baris: '', status: 'tersedia' });
        setFormErrors({});
        setTouched({});
        setShowModal(true);
    };

    const openEdit = (seat) => {
        setEditSeat(seat);
        setForm({ nomor_kursi: seat.nomor_kursi, baris: seat.baris, status: seat.status });
        setFormErrors({});
        setTouched({});
        setShowModal(true);
    };

    const handleFormChange = (field, value) => {
        const newForm = { ...form, [field]: value };

        // Auto-isi baris dari nomor_kursi
        if (field === 'nomor_kursi' && value.length === 1 && /[A-Za-z]/.test(value)) {
            newForm.baris = value.toUpperCase();
        }

        setForm(newForm);

        // Real-time validasi jika field sudah pernah disentuh
        if (touched[field]) {
            const errors = validateForm(newForm, seats, editSeat);
            setFormErrors(errors);
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const errors = validateForm(form, seats, editSeat);
        setFormErrors(errors);
    };

    const handleSubmit = async () => {
        // Tandai semua field sebagai touched
        setTouched({ nomor_kursi: true, baris: true, status: true });
        const errors = validateForm(form, seats, editSeat);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            if (editSeat) {
                await axios.put(`${BASE_URL}/seats/${editSeat.id_seat}`, {
                    ...form,
                    nomor_kursi: form.nomor_kursi.toUpperCase(),
                    baris: form.baris.toUpperCase(),
                });
                showToast('Kursi berhasil diupdate');
            } else {
                await axios.post(`${BASE_URL}/seats`, {
                    ...form,
                    nomor_kursi: form.nomor_kursi.toUpperCase(),
                    baris: form.baris.toUpperCase(),
                });
                showToast('Kursi berhasil ditambahkan');
            }
            setShowModal(false);
            fetchSeats();
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal menyimpan', 'error');
        }
    };

    // ── Generate handlers ──────────────────────────────────────────────────────
    const handleGenChange = (field, value) => {
        const newGenForm = { ...genForm, [field]: value };
        setGenForm(newGenForm);
        if (genTouched[field]) {
            setGenErrors(validateGenForm(newGenForm));
        }
    };

    const handleGenBlur = (field) => {
        setGenTouched(prev => ({ ...prev, [field]: true }));
        setGenErrors(validateGenForm(genForm));
    };

    const handleGenerate = async () => {
        setGenTouched({ baris_awal: true, baris_akhir: true, jumlah_per_baris: true });
        const errors = validateGenForm(genForm);
        setGenErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            const res = await axios.post(`${BASE_URL}/seats/generate`, {
                ...genForm,
                baris_awal: genForm.baris_awal.toUpperCase(),
                baris_akhir: genForm.baris_akhir.toUpperCase(),
                jumlah_per_baris: parseInt(genForm.jumlah_per_baris),
            });
            showToast(res.data.message);
            setShowGenerate(false);
            fetchSeats();
        } catch (err) {
            showToast(err.response?.data?.message || 'Gagal generate', 'error');
        }
    };

    // ── CRUD ───────────────────────────────────────────────────────────────────
    const toggleStatus = async (seat) => {
        const newStatus = seat.status === 'tersedia' ? 'dipesan' : 'tersedia';
        try {
            await axios.put(`${BASE_URL}/seats/${seat.id_seat}`, { ...seat, status: newStatus });
            setSeats(prev => prev.map(s => s.id_seat === seat.id_seat ? { ...s, status: newStatus } : s));
        } catch {
            showToast('Gagal mengubah status', 'error');
        }
    };

    const deleteSeat = async (id) => {
        if (!window.confirm('Hapus kursi ini?')) return;
        try {
            await axios.delete(`${BASE_URL}/seats/${id}`);
            setSeats(prev => prev.filter(s => s.id_seat !== id));
            showToast('Kursi berhasil dihapus');
        } catch {
            showToast('Gagal menghapus', 'error');
        }
    };

    const deleteAll = async () => {
        if (!window.confirm('Hapus SEMUA kursi? Tindakan ini tidak bisa dibatalkan.')) return;
        try {
            await axios.delete(`${BASE_URL}/seats`);
            setSeats([]);
            showToast('Semua kursi berhasil dihapus');
        } catch {
            showToast('Gagal menghapus semua kursi', 'error');
        }
    };

    const totalTersedia = seats.filter(s => s.status === 'tersedia').length;
    const totalDipesan  = seats.filter(s => s.status === 'dipesan').length;

    // ── Error message component ────────────────────────────────────────────────
    const ErrMsg = ({ msg }) => msg ? (
        <p style={{ color: '#f87171', fontSize: '0.75rem', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            ⚠ {msg}
        </p>
    ) : null;

    // ── Input style helper ─────────────────────────────────────────────────────
    const inputStyle = (field, errors) => ({
        width: '100%', background: '#0f1726',
        border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none',
        transition: 'border-color .2s',
    });

    return (
        <AdminLayout activeMenu="seats">
            <div className="container-fluid">

                {/* Toast */}
                {toast && (
                    <div role="alert" style={{
                        position: 'fixed', top: 24, right: 24, zIndex: 9999,
                        padding: '12px 20px', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem',
                        backgroundColor: toast.type === 'error' ? '#ef4444' : '#22c55e',
                        color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        animation: 'fadeIn .2s ease',
                    }}>
                        {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
                    </div>
                )}

                <style>{`
                    @keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
                    .seat-box { width:44px; height:44px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; cursor:pointer; transition:all .15s; border:2px solid transparent; user-select:none; }
                    .seat-box.tersedia { background:rgba(34,197,94,0.15); color:#4ade80; border-color:rgba(34,197,94,0.3); }
                    .seat-box.tersedia:hover { background:rgba(34,197,94,0.28); border-color:#4ade80; transform:scale(1.08); }
                    .seat-box.dipesan { background:rgba(239,68,68,0.15); color:#f87171; border-color:rgba(239,68,68,0.3); }
                    .seat-box.dipesan:hover { background:rgba(239,68,68,0.28); border-color:#f87171; transform:scale(1.08); }
                    .admin-row { background-color:#0f1726; border-radius:16px; transition:all .25s; border:1px solid transparent; }
                    .admin-row:hover { background-color:#111827; border-color:rgba(56,189,248,0.18); }
                    .action-btn { display:inline-flex; align-items:center; justify-content:center; min-width:70px; padding:8px 12px; border-radius:10px; border:none; font-weight:600; font-size:0.82rem; cursor:pointer; transition:transform .2s, filter .2s; }
                    .action-btn:hover { transform:translateY(-1px); filter:brightness(1.1); }
                    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:1000; }
                    .modal-box { background:#111827; border-radius:20px; padding:32px; width:100%; max-width:440px; border:1px solid rgba(255,255,255,0.08); }
                    .view-btn { padding:8px 16px; border-radius:10px; border:none; font-weight:600; font-size:0.82rem; cursor:pointer; transition:all .2s; }
                    .form-input-focus:focus { border-color:#3b82f6 !important; }
                `}</style>

                <div className="p-5 rounded-4" style={{ background: '#111827', border: '1px solid rgba(148,163,184,0.12)' }}>

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap" style={{ gap: 12 }}>
                        <div>
                            <h2 className="m-0 text-white" style={{ fontSize: '1.3rem' }}>Manajemen Kursi</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '8px 0 0' }}>Kelola kursi bioskop — tambah, edit, hapus, dan ubah status.</p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            <button onClick={() => { setGenErrors({}); setGenTouched({}); setShowGenerate(true); }} className="btn" style={{ padding: '12px 20px', borderRadius: 14, backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)', fontWeight: 700 }}>
                                ⚡ Generate
                            </button>
                            <button onClick={deleteAll} className="btn" style={{ padding: '12px 20px', borderRadius: 14, backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 700 }}>
                                🗑 Reset Semua
                            </button>
                            <button onClick={openAdd} className="btn btn-primary fw-bold" style={{ padding: '12px 20px', borderRadius: 14, boxShadow: '0 8px 24px rgba(37,99,235,0.2)' }}>
                                + Tambah Kursi
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="d-flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
                        {[
                            { label: 'Total Kursi', value: seats.length,  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
                            { label: 'Tersedia',    value: totalTersedia, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
                            { label: 'Dipesan',     value: totalDipesan,  color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
                        ].map(s => (
                            <div key={s.label} style={{ padding: '14px 20px', borderRadius: 14, backgroundColor: s.bg, border: `1px solid ${s.color}30`, minWidth: 110 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                        <div className="d-flex gap-2 ms-auto align-items-center">
                            <button className="view-btn" onClick={() => setViewMode('grid')} style={{ backgroundColor: viewMode === 'grid' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)', color: viewMode === 'grid' ? '#60a5fa' : '#94a3b8' }}>🎬 Grid</button>
                            <button className="view-btn" onClick={() => setViewMode('table')} style={{ backgroundColor: viewMode === 'table' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)', color: viewMode === 'table' ? '#60a5fa' : '#94a3b8' }}>📋 Tabel</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5" style={{ color: '#94a3b8' }}>Memuat data kursi...</div>
                    ) : seats.length === 0 ? (
                        <div className="text-center py-5" style={{ color: '#94a3b8' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🪑</div>
                            <p>Belum ada kursi. Klik <strong>Generate</strong> untuk membuat kursi otomatis.</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <div style={{ display: 'inline-block', padding: '8px 80px', background: 'linear-gradient(180deg,rgba(96,165,250,0.25),transparent)', borderRadius: '0 0 60% 60% / 0 0 30px 30px', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '3px', marginBottom: 4 }}>LAYAR</div>
                                <div style={{ height: 4, background: 'linear-gradient(90deg,transparent,#3b82f6,transparent)', borderRadius: 4 }} />
                            </div>
                            <div className="d-flex gap-4 justify-content-center mb-4">
                                {[{ label: 'Tersedia', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' }, { label: 'Dipesan', color: '#f87171', bg: 'rgba(248,113,113,0.15)' }].map(l => (
                                    <div key={l.label} className="d-flex align-items-center gap-2">
                                        <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: l.bg, border: `2px solid ${l.color}` }} />
                                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                                {sortedRows.map(baris => (
                                    <div key={baris} className="d-flex align-items-center gap-2 mb-3" style={{ minWidth: 'max-content', margin: '0 auto', justifyContent: 'center' }}>
                                        <div style={{ width: 24, color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', flexShrink: 0 }}>{baris}</div>
                                        <div className="d-flex gap-2">
                                            {seatsByRow[baris].map(seat => (
                                                <div key={seat.id_seat} className={`seat-box ${seat.status}`} onClick={() => toggleStatus(seat)} title={`${seat.nomor_kursi} — ${seat.status}`}>
                                                    {seat.nomor_kursi}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ width: 24, color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', flexShrink: 0 }}>{baris}</div>
                                    </div>
                                ))}
                            </div>
                            <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: 16 }}>💡 Klik kursi untuk mengubah status tersedia ↔ dipesan</p>
                        </div>
                    ) : (
                        <div>
                            <div className="row px-4 mb-3" style={{ color: '#64748b', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
                                <div className="col-1">No</div>
                                <div className="col-3">Nomor Kursi</div>
                                <div className="col-2">Baris</div>
                                <div className="col-3">Status</div>
                                <div className="col-3 text-end">Aksi</div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {seats.map((seat, i) => (
                                    <div key={seat.id_seat} className="row px-4 py-3 align-items-center admin-row">
                                        <div className="col-1" style={{ color: '#64748b', fontWeight: 600 }}>{i + 1}</div>
                                        <div className="col-3" style={{ color: '#f1f5f9', fontWeight: 600 }}>🪑 {seat.nomor_kursi}</div>
                                        <div className="col-2" style={{ color: '#94a3b8' }}>{seat.baris}</div>
                                        <div className="col-3">
                                            <button onClick={() => toggleStatus(seat)} style={{ padding: '5px 14px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', backgroundColor: seat.status === 'tersedia' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: seat.status === 'tersedia' ? '#4ade80' : '#f87171' }}>
                                                {seat.status === 'tersedia' ? '● Tersedia' : '● Dipesan'}
                                            </button>
                                        </div>
                                        <div className="col-3 text-end d-flex justify-content-end gap-2">
                                            <button onClick={() => openEdit(seat)} className="action-btn" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>Edit</button>
                                            <button onClick={() => deleteSeat(seat.id_seat)} className="action-btn" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: '#f87171' }}>Hapus</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── MODAL TAMBAH / EDIT ── */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <h5 style={{ color: '#f1f5f9', marginBottom: 24, fontWeight: 700 }}>
                                {editSeat ? '✏️ Edit Kursi' : '➕ Tambah Kursi'}
                            </h5>
                            <div className="d-flex flex-column gap-3">

                                {/* Nomor Kursi */}
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                                        Nomor Kursi <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        className="form-input-focus"
                                        style={inputStyle('nomor_kursi', formErrors)}
                                        placeholder="Contoh: A1, B10"
                                        value={form.nomor_kursi}
                                        onChange={e => handleFormChange('nomor_kursi', e.target.value.toUpperCase())}
                                        onBlur={() => handleBlur('nomor_kursi')}
                                    />
                                    <ErrMsg msg={touched.nomor_kursi && formErrors.nomor_kursi} />
                                </div>

                                {/* Baris */}
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                                        Baris <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        className="form-input-focus"
                                        style={inputStyle('baris', formErrors)}
                                        placeholder="Contoh: A"
                                        value={form.baris}
                                        maxLength={1}
                                        onChange={e => handleFormChange('baris', e.target.value.toUpperCase())}
                                        onBlur={() => handleBlur('baris')}
                                    />
                                    <ErrMsg msg={touched.baris && formErrors.baris} />
                                </div>

                                {/* Status */}
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>Status</label>
                                    <select
                                        className="form-input-focus"
                                        style={inputStyle('status', formErrors)}
                                        value={form.status}
                                        onChange={e => handleFormChange('status', e.target.value)}
                                    >
                                        <option value="tersedia">Tersedia</option>
                                        <option value="dipesan">Dipesan</option>
                                    </select>
                                </div>

                                <div className="d-flex gap-2 mt-2">
                                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}>
                                        Batal
                                    </button>
                                    <button onClick={handleSubmit} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                        {editSeat ? 'Simpan' : 'Tambah'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MODAL GENERATE ── */}
                {showGenerate && (
                    <div className="modal-overlay" onClick={() => setShowGenerate(false)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()}>
                            <h5 style={{ color: '#f1f5f9', marginBottom: 8, fontWeight: 700 }}>⚡ Generate Kursi Otomatis</h5>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 24 }}>
                                Contoh: A s/d E, 10 kursi → A1–A10, B1–B10, ... E1–E10
                            </p>
                            <div className="d-flex flex-column gap-3">

                                <div className="d-flex gap-3">
                                    {/* Baris Awal */}
                                    <div style={{ flex: 1 }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                                            Baris Awal <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            className="form-input-focus"
                                            style={inputStyle('baris_awal', genErrors)}
                                            value={genForm.baris_awal}
                                            maxLength={1}
                                            onChange={e => handleGenChange('baris_awal', e.target.value.toUpperCase())}
                                            onBlur={() => handleGenBlur('baris_awal')}
                                        />
                                        <ErrMsg msg={genTouched.baris_awal && genErrors.baris_awal} />
                                    </div>
                                    {/* Baris Akhir */}
                                    <div style={{ flex: 1 }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                                            Baris Akhir <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            className="form-input-focus"
                                            style={inputStyle('baris_akhir', genErrors)}
                                            value={genForm.baris_akhir}
                                            maxLength={1}
                                            onChange={e => handleGenChange('baris_akhir', e.target.value.toUpperCase())}
                                            onBlur={() => handleGenBlur('baris_akhir')}
                                        />
                                        <ErrMsg msg={genTouched.baris_akhir && genErrors.baris_akhir} />
                                    </div>
                                </div>

                                {/* Jumlah per baris */}
                                <div>
                                    <label style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                                        Jumlah Kursi per Baris <span style={{ color: '#ef4444' }}>*</span>
                                        <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: 8 }}>(1–30)</span>
                                    </label>
                                    <input
                                        className="form-input-focus"
                                        style={inputStyle('jumlah_per_baris', genErrors)}
                                        type="number" min={1} max={30}
                                        value={genForm.jumlah_per_baris}
                                        onChange={e => handleGenChange('jumlah_per_baris', e.target.value)}
                                        onBlur={() => handleGenBlur('jumlah_per_baris')}
                                    />
                                    <ErrMsg msg={genTouched.jumlah_per_baris && genErrors.jumlah_per_baris} />
                                </div>

                                {/* Preview jumlah kursi */}
                                {!Object.keys(genErrors).length && genForm.baris_awal && genForm.baris_akhir && genForm.jumlah_per_baris && (
                                    <div style={{ padding: '10px 14px', borderRadius: 10, backgroundColor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', fontSize: '0.82rem', color: '#c084fc' }}>
                                        ✨ Akan membuat <strong>
                                            {(genForm.baris_akhir.toUpperCase().charCodeAt(0) - genForm.baris_awal.toUpperCase().charCodeAt(0) + 1) * parseInt(genForm.jumlah_per_baris || 0)}
                                        </strong> kursi ({genForm.baris_awal.toUpperCase()}–{genForm.baris_akhir.toUpperCase()}, {genForm.jumlah_per_baris} per baris)
                                    </div>
                                )}

                                <div className="d-flex gap-2 mt-2">
                                    <button onClick={() => setShowGenerate(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}>
                                        Batal
                                    </button>
                                    <button onClick={handleGenerate} style={{ flex: 1, padding: '12px', borderRadius: 12, backgroundColor: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default ManageSeats;