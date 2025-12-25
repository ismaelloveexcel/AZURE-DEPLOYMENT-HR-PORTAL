import streamlit as st
import pandas as pd
import os
from datetime import datetime, timedelta
import json

st.set_page_config(
    page_title="Medical Insurance Verification | Baynunah",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="collapsed"
)

POLICY_YEAR = "2026"
RENEWAL_DEADLINE = datetime(2026, 1, 31)
SESSION_TIMEOUT_MINUTES = 15

CUSTOM_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display: none;}
    
    .stApp {
        font-family: 'Poppins', sans-serif;
        background-color: #f5f5f5;
    }
    
    .main-header {
        background: #1E1B5C;
        padding: 18px 30px;
        margin: -80px -80px 0 -80px;
        color: white;
        position: sticky;
        top: 0;
        z-index: 999;
    }
    
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .header-left {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .company-logo {
        width: 42px;
        height: 42px;
        background: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
    
    .header-title h1 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .header-title .subtitle {
        font-size: 11px;
        opacity: 0.8;
        margin-top: 2px;
        font-weight: 400;
    }
    
    .header-right {
        display: flex;
        align-items: center;
        gap: 25px;
    }
    
    .policy-badge {
        background: rgba(255,255,255,0.15);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 500;
    }
    
    .user-block {
        text-align: right;
    }
    
    .user-name {
        font-size: 13px;
        font-weight: 500;
    }
    
    .user-id {
        font-size: 10px;
        opacity: 0.7;
    }
    
    .status-strip {
        background: #fff;
        border-bottom: 1px solid #e5e5e5;
        padding: 10px 30px;
        margin: 0 -80px 20px -80px;
        display: flex;
        justify-content: center;
        gap: 40px;
        font-size: 12px;
        color: #666;
    }
    
    .status-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .glass-card {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    
    .card-title {
        color: #1E1B5C;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
    }
    
    .snapshot-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px 40px;
    }
    
    .snapshot-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .snapshot-label {
        color: #888;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .snapshot-value {
        color: #1E1B5C;
        font-size: 14px;
        font-weight: 500;
    }
    
    .member-card {
        background: #fafafa;
        border-radius: 10px;
        padding: 18px;
        margin-bottom: 12px;
        border: 1px solid #eee;
    }
    
    .member-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    
    .member-name {
        color: #1E1B5C;
        font-size: 14px;
        font-weight: 600;
    }
    
    .member-badge {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .badge-principal {
        background: rgba(30, 27, 92, 0.1);
        color: #1E1B5C;
    }
    
    .badge-spouse {
        background: rgba(236, 72, 153, 0.1);
        color: #be185d;
    }
    
    .badge-child {
        background: rgba(245, 158, 11, 0.1);
        color: #b45309;
    }
    
    .member-details {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px 24px;
    }
    
    .member-detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        padding: 2px 0;
    }
    
    .member-detail-label {
        color: #888;
    }
    
    .member-detail-value {
        color: #333;
        font-weight: 500;
    }
    
    .missing-value {
        color: #dc2626;
        font-size: 11px;
    }
    
    .missing-banner {
        background: rgba(220, 38, 38, 0.05);
        border-left: 3px solid #dc2626;
        border-radius: 0 8px 8px 0;
        padding: 10px 14px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #b91c1c;
        font-size: 12px;
    }
    
    .confirmation-card {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    
    .radio-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        border: 2px solid #e5e5e5;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .radio-option:hover {
        border-color: #1E1B5C;
    }
    
    .radio-option.selected {
        border-color: #1E1B5C;
        background: rgba(30, 27, 92, 0.03);
    }
    
    .success-message {
        background: rgba(22, 163, 74, 0.08);
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        margin: 16px 0;
    }
    
    .success-icon {
        width: 60px;
        height: 60px;
        background: rgba(22, 163, 74, 0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 28px;
        color: #16a34a;
    }
    
    .success-title {
        color: #1E1B5C;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 6px;
    }
    
    .success-desc {
        color: #666;
        font-size: 13px;
        line-height: 1.5;
    }
    
    .change-log {
        background: #fffbeb;
        border: 1px solid #fcd34d;
        border-radius: 8px;
        padding: 14px;
        margin-top: 14px;
    }
    
    .change-item {
        display: flex;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid #fef3c7;
        font-size: 12px;
    }
    
    .change-item:last-child {
        border-bottom: none;
    }
    
    .old-value {
        color: #dc2626;
        text-decoration: line-through;
    }
    
    .new-value {
        color: #16a34a;
        font-weight: 500;
    }
    
    .login-container {
        max-width: 360px;
        margin: 60px auto;
        text-align: center;
    }
    
    .login-form-wrapper {
        max-width: 360px;
        margin: 0 auto;
    }
    
    .content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .login-header {
        margin-bottom: 25px;
    }
    
    .login-logo {
        width: 48px;
        height: 48px;
        background: #1E1B5C;
        border-radius: 12px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
    }
    
    .login-title {
        color: #1E1B5C;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    
    .login-subtitle {
        color: #888;
        font-size: 12px;
        font-weight: 400;
    }
    
    .login-badge {
        display: inline-block;
        background: rgba(30, 27, 92, 0.08);
        color: #1E1B5C;
        padding: 5px 14px;
        border-radius: 15px;
        font-size: 11px;
        font-weight: 600;
        margin-top: 12px;
    }
    
    .stButton > button {
        background: #1E1B5C;
        color: white;
        border: none;
        padding: 12px 28px;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 1px;
        text-transform: uppercase;
        border-radius: 8px;
        width: 100%;
        transition: all 0.2s ease;
        font-family: 'Poppins', sans-serif;
    }
    
    .stButton > button:hover {
        background: #2d2a6e;
    }
    
    .signout-btn button {
        background: transparent !important;
        border: 1px solid #ddd !important;
        color: #666 !important;
        padding: 6px 16px !important;
        font-size: 11px !important;
        letter-spacing: 0.5px !important;
    }
    
    .signout-btn button:hover {
        background: #f5f5f5 !important;
    }
    
    .section-label {
        color: #666;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        font-weight: 600;
    }
    
    div[data-testid="stForm"] {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    
    .stTextInput > div > div > input {
        border-radius: 8px;
        border: 1px solid #ddd;
        padding: 10px 12px;
        font-family: 'Poppins', sans-serif;
        font-size: 13px;
    }
    
    .stTextInput > div > div > input:focus {
        border-color: #1E1B5C;
        box-shadow: 0 0 0 2px rgba(30, 27, 92, 0.1);
    }
    
    .stSelectbox > div > div {
        border-radius: 8px;
    }
    
    .stTextArea > div > div > textarea {
        border-radius: 8px;
        border: 1px solid #ddd;
        font-family: 'Poppins', sans-serif;
        font-size: 13px;
    }
    
    .stTextArea > div > div > textarea:focus {
        border-color: #1E1B5C;
        box-shadow: 0 0 0 2px rgba(30, 27, 92, 0.1);
    }
    
    .stRadio > div {
        gap: 8px;
    }
    
    .stRadio label {
        padding: 12px 16px !important;
        border: 2px solid #e5e5e5 !important;
        border-radius: 8px !important;
        margin-bottom: 8px !important;
    }
    
    .expired-notice {
        background: white;
        border-radius: 12px;
        padding: 40px 30px;
        text-align: center;
        max-width: 420px;
        margin: 80px auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    
    .inline-error {
        color: #dc2626;
        font-size: 11px;
        margin-top: 4px;
    }
    
    .field-hint {
        color: #888;
        font-size: 11px;
        margin-top: 4px;
    }
</style>
"""

SESSION_TIMEOUT_JS = f"""
<script>
    var sessionTimeout = {SESSION_TIMEOUT_MINUTES * 60 * 1000};
    var warningTime = {(SESSION_TIMEOUT_MINUTES - 2) * 60 * 1000};
    var sessionTimer;
    var warningTimer;
    
    function resetTimers() {{
        clearTimeout(sessionTimer);
        clearTimeout(warningTimer);
        
        warningTimer = setTimeout(function() {{
            alert('Your session will expire in 2 minutes due to inactivity.');
        }}, warningTime);
        
        sessionTimer = setTimeout(function() {{
            alert('Session expired due to inactivity. Please log in again.');
            window.location.reload();
        }}, sessionTimeout);
    }}
    
    document.addEventListener('click', resetTimers);
    document.addEventListener('keypress', resetTimers);
    document.addEventListener('scroll', resetTimers);
    
    resetTimers();
</script>
"""

DATA_FILE = "attached_assets/Medical_Insurance_Data.csv"
JOB_DATA_FILE = "attached_assets/job_data.csv"
CHANGES_FILE = "attached_assets/correction_requests.json"

@st.cache_data
def load_job_data():
    if os.path.exists(JOB_DATA_FILE):
        return pd.read_csv(JOB_DATA_FILE, encoding='utf-8-sig')
    return pd.DataFrame()

@st.cache_data
def load_data():
    df = pd.read_csv(DATA_FILE, encoding='utf-8-sig')
    job_df = load_job_data()
    if not job_df.empty:
        df = df.merge(job_df[['Staff Number', 'JOB TITLE', 'DEPARTMENT']], on='Staff Number', how='left')
    return df

def save_data(df):
    df.to_csv(DATA_FILE, index=False, encoding='utf-8-sig')

def load_changes():
    if os.path.exists(CHANGES_FILE):
        with open(CHANGES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_change_request(change_data):
    changes = load_changes()
    changes.append(change_data)
    with open(CHANGES_FILE, 'w') as f:
        json.dump(changes, f, indent=2)

def get_employee_data(df, staff_number):
    return df[df['Staff Number'] == staff_number]

def verify_credentials(df, staff_number, dob_input):
    principals = df[(df['Relation'] == 'PRINCIPAL') & (df['Staff Number'] == staff_number)]
    if principals.empty:
        return False, "Invalid Staff Number."
    
    principal = principals.iloc[0]
    dob_raw = principal.get('Date Of Birth', '')
    
    if pd.isna(dob_raw) or str(dob_raw).strip() == '' or str(dob_raw).strip() == 'nan':
        return False, "Account not properly configured. Please contact HR."
    
    dob_str = str(dob_raw).strip()
    
    try:
        if ' ' in dob_str:
            parts = dob_str.split(' ')
            dob_str = parts[0]
        
        formats_to_try = [
            ('%d/%m/%Y', '%d/%m/%Y'),
            ('%m/%d/%Y', '%d/%m/%Y'),
            ('%Y-%m-%d', '%d/%m/%Y'),
        ]
        
        actual_dob = None
        for parse_fmt, output_fmt in formats_to_try:
            try:
                parsed_date = datetime.strptime(dob_str, parse_fmt)
                if parsed_date.year < 1920 or parsed_date.year > 2025:
                    continue
                actual_dob = parsed_date.strftime(output_fmt)
                break
            except ValueError:
                continue
        
        if actual_dob is None:
            actual_dob = dob_str
        
        if dob_input.strip() == actual_dob:
            return True, None
        else:
            return False, "Invalid credentials. Please check your Staff Number and Date of Birth."
    except Exception:
        return False, "Account verification issue. Please contact HR."

def format_field(value):
    if pd.isna(value) or str(value).strip() == "" or str(value).strip() == "nan":
        return None
    return str(value).strip()

def check_link_expired():
    return datetime.now() > RENEWAL_DEADLINE

def render_expired_page():
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
    st.markdown("""
    <div class="expired-notice">
        <div style="font-size: 48px; margin-bottom: 20px;">⏰</div>
        <h2 style="color: #1a1a2e; font-size: 1.3em; margin-bottom: 12px;">Verification Period Ended</h2>
        <p style="color: #888; font-size: 0.9em; line-height: 1.6;">The medical insurance renewal verification period has closed.</p>
        <p style="color: #888; font-size: 0.85em; margin-top: 20px;">For any changes, please contact HR directly.</p>
        <a href="https://wa.me/971564966546" target="_blank" style="display: inline-block; margin-top: 25px; background: #25D366; color: white; padding: 12px 28px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 0.85em;">
            📱 Contact HR via WhatsApp
        </a>
    </div>
    """, unsafe_allow_html=True)

def render_login():
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
    
    st.markdown(f"""
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">🏥</div>
            <h1 class="login-title">Medical Insurance Verification</h1>
            <p class="login-subtitle">Employee Self-Service Portal</p>
            <div class="login-badge">Policy Year {POLICY_YEAR}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1.2, 1, 1.2])
    with col2:
        with st.form("login_form"):
            staff_number = st.text_input(
                "Staff Number",
                placeholder="e.g., BAYN00001",
                key="staff_input"
            )
            
            dob_input = st.text_input(
                "Date of Birth",
                placeholder="DD/MM/YYYY",
                key="dob_input"
            )
            
            submitted = st.form_submit_button("Sign In", use_container_width=True)
            
            if submitted:
                if not staff_number:
                    st.error("Please enter your Staff Number.")
                elif not dob_input:
                    st.error("Please enter your Date of Birth (DD/MM/YYYY).")
                else:
                    df = load_data()
                    is_valid, error_msg = verify_credentials(df, staff_number.upper(), dob_input)
                    
                    if is_valid:
                        st.session_state['authenticated'] = True
                        st.session_state['staff_number'] = staff_number.upper()
                        st.session_state['login_time'] = datetime.now().isoformat()
                        st.rerun()
                    else:
                        st.error(error_msg)
        
        st.markdown("""
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #aaa; font-size: 11px;">Need assistance?</p>
            <a href="https://wa.me/971564966546" target="_blank" style="color: #25D366; text-decoration: none; font-weight: 600; font-size: 12px;">
                WhatsApp HR Support
            </a>
        </div>
        """, unsafe_allow_html=True)

def render_header(principal_name, staff_number):
    st.markdown(f"""
    <div class="main-header">
        <div class="header-content">
            <div class="header-left">
                <div class="company-logo">🏥</div>
                <div class="header-title">
                    <h1>Medical Insurance Verification</h1>
                    <div class="subtitle">Employee Self-Service Portal</div>
                </div>
            </div>
            <div class="header-right">
                <div class="policy-badge">Policy Year {POLICY_YEAR}</div>
                <div class="user-block">
                    <div class="user-name">{principal_name}</div>
                    <div class="user-id">{staff_number}</div>
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_status_strip():
    days_left = (RENEWAL_DEADLINE - datetime.now()).days
    deadline_str = RENEWAL_DEADLINE.strftime('%d %B %Y')
    st.markdown(f"""
    <div class="status-strip">
        <div class="status-item">
            <span>⏱</span>
            <span>Session timeout: {SESSION_TIMEOUT_MINUTES} min</span>
        </div>
        <div class="status-item">
            <span>📅</span>
            <span>Deadline: {deadline_str} ({days_left} days left)</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

def render_employee_snapshot(principal, staff_number):
    job_title = format_field(principal.get('JOB TITLE')) or format_field(principal.get('Job Title')) or "—"
    department = format_field(principal.get('DEPARTMENT')) or format_field(principal.get('Department')) or "—"
    emp_name = format_field(principal['Principal Name']) or '—'
    
    st.markdown(f"""
    <div class="glass-card">
        <div class="card-title">👤 Employee Snapshot</div>
        <div class="snapshot-grid">
            <div class="snapshot-item">
                <span class="snapshot-label">Employee Number</span>
                <span class="snapshot-value">{staff_number}</span>
            </div>
            <div class="snapshot-item">
                <span class="snapshot-label">Job Title</span>
                <span class="snapshot-value">{job_title}</span>
            </div>
            <div class="snapshot-item">
                <span class="snapshot-label">Employee Name</span>
                <span class="snapshot-value">{emp_name}</span>
            </div>
            <div class="snapshot-item">
                <span class="snapshot-label">Department</span>
                <span class="snapshot-value">{department}</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

def format_emirates_id(eid):
    if not eid:
        return None
    eid_str = str(eid).replace(' ', '').replace('-', '')
    if len(eid_str) == 15:
        return f"{eid_str[:3]}-{eid_str[3:7]}-{eid_str[7:14]}-{eid_str[14]}"
    return eid_str

def render_covered_members(employee_data):
    st.markdown("""
    <div class="glass-card">
        <div class="card-title">👥 Covered Members</div>
    """, unsafe_allow_html=True)
    
    has_missing = False
    for _, member in employee_data.iterrows():
        eid = format_field(member.get('National Identity'))
        passport = format_field(member.get('Passport number'))
        if not eid and not passport:
            has_missing = True
            break
    
    if has_missing:
        st.markdown("""
        <div class="missing-banner">
            <span>⚠️</span>
            <span>Some members have missing information. Please review and submit corrections if needed.</span>
        </div>
        """, unsafe_allow_html=True)
    
    for _, member in employee_data.iterrows():
        relation = member['Relation']
        badge_class = "badge-principal" if relation == "PRINCIPAL" else ("badge-spouse" if relation == "SPOUSE" else "badge-child")
        
        first_name = format_field(member.get('Member First Name')) or ''
        middle_name = format_field(member.get('Member Middle Name')) or ''
        last_name = format_field(member.get('Member Last Name')) or ''
        full_name = format_field(member.get('Member Full Name')) or f"{first_name} {middle_name} {last_name}".strip()
        full_name = ' '.join(full_name.split())
        
        dob = format_field(member.get('Date Of Birth'))
        if dob and ' ' in dob:
            dob = dob.split(' ')[0]
        dob = dob or "—"
        
        gender = format_field(member.get('Gender')) or "—"
        nationality = format_field(member.get('Nationality')) or "—"
        marital_status = format_field(member.get('Marital Status')) or "—"
        emirates_id = format_field(member.get('National Identity'))
        visa_unified = format_field(member.get('Visa Unified Number'))
        passport = format_field(member.get('Passport number'))
        
        eid_formatted = format_emirates_id(emirates_id) if emirates_id else None
        eid_display = eid_formatted if eid_formatted else '<span class="missing-value">Not provided</span>'
        visa_display = visa_unified if visa_unified else '<span class="missing-value">Not provided</span>'
        passport_display = passport if passport else '<span class="missing-value">Not provided</span>'
        
        st.markdown(f"""
        <div class="member-card">
            <div class="member-header">
                <span class="member-name">{full_name}</span>
                <span class="member-badge {badge_class}">{relation}</span>
            </div>
            <div class="member-details">
                <div class="member-detail-item">
                    <span class="member-detail-label">Gender</span>
                    <span class="member-detail-value">{gender}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Date of Birth</span>
                    <span class="member-detail-value">{dob}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Nationality</span>
                    <span class="member-detail-value">{nationality}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Marital Status</span>
                    <span class="member-detail-value">{marital_status}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Emirates ID</span>
                    <span class="member-detail-value">{eid_display}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Visa Unified No.</span>
                    <span class="member-detail-value">{visa_display}</span>
                </div>
                <div class="member-detail-item">
                    <span class="member-detail-label">Passport</span>
                    <span class="member-detail-value">{passport_display}</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

def render_confirmation_section(employee_data, staff_number):
    confirmed = employee_data['EmployeeConfirmed'].iloc[0] if 'EmployeeConfirmed' in employee_data.columns else ""
    if not confirmed or str(confirmed).strip() == "":
        confirmed = employee_data['Confirmed'].iloc[0] if 'Confirmed' in employee_data.columns else ""
    already_confirmed = pd.notna(confirmed) and str(confirmed).strip() != ""
    
    if already_confirmed:
        st.markdown(f"""
        <div class="success-message">
            <div class="success-icon">✓</div>
            <div class="success-title">Information Confirmed</div>
            <div class="success-desc">You confirmed your information on {confirmed}.<br>HR will proceed with the insurance renewal.</div>
        </div>
        """, unsafe_allow_html=True)
        return
    
    if 'submission_success' in st.session_state and st.session_state['submission_success']:
        if st.session_state.get('submission_type') == 'confirmation':
            st.markdown("""
            <div class="success-message">
                <div class="success-icon">✓</div>
                <div class="success-title">Thank You!</div>
                <div class="success-desc">Your information has been confirmed.<br>HR will proceed with the renewal.</div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="success-message">
                <div class="success-icon">📤</div>
                <div class="success-title">Change Request Submitted</div>
                <div class="success-desc">Your request requires HR approval.<br>You will be notified once reviewed.</div>
            </div>
            """, unsafe_allow_html=True)
        return
    
    st.markdown("""
    <div class="glass-card">
        <div class="card-title">✔️ Confirmation</div>
        <p style="color: #666; font-size: 0.9em; margin-bottom: 20px;">
            Please review the information above. If everything is correct, confirm below. 
            If you need to request changes, select the correction option.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    action = st.radio(
        "Select your action:",
        ["✅ I confirm that all information above is accurate",
         "📝 I need to update information"],
        key="action_choice",
        label_visibility="collapsed"
    )
    
    if "I confirm" in action:
        st.markdown("---")
        confirm_checkbox = st.checkbox(
            "I hereby confirm that all the information displayed for myself and my dependents is accurate and complete.",
            key="confirm_checkbox"
        )
        
        if st.button("Submit Confirmation", type="primary", disabled=not confirm_checkbox):
            df = load_data()
            confirmation_time = datetime.now().strftime("%d/%m/%Y %I:%M %p")
            df.loc[df['Staff Number'] == staff_number, 'EmployeeConfirmed'] = confirmation_time
            save_data(df)
            st.cache_data.clear()
            st.session_state['submission_success'] = True
            st.session_state['submission_type'] = 'confirmation'
            st.balloons()
            st.rerun()
    
    else:
        render_correction_form(employee_data, staff_number)

def render_correction_form(employee_data, staff_number):
    st.markdown("""
    <div class="glass-card">
        <div class="card-title">📝 Update Information</div>
        <p style="color: #666; font-size: 0.85em; margin-bottom: 15px;">
            Select a member to add missing information or request changes.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    editable_members = []
    for _, member in employee_data.iterrows():
        relation = member['Relation']
        name = format_field(member.get('Member Full Name')) or f"{format_field(member.get('Member First Name')) or ''} {format_field(member.get('Member Middle Name')) or ''} {format_field(member.get('Member Last Name')) or ''}".strip()
        name = ' '.join(name.split())
        label = f"PRINCIPAL (Self): {name}" if relation == "PRINCIPAL" else f"{relation}: {name}"
        editable_members.append({
            "label": label,
            "row": member,
            "is_principal": relation == "PRINCIPAL"
        })
    
    member_options = [m["label"] for m in editable_members]
    selected_member = st.selectbox("Select Member", member_options, key="selected_member")
    
    selected_idx = member_options.index(selected_member)
    member_info = editable_members[selected_idx]
    member_row = member_info["row"]
    is_principal = member_info["is_principal"]
    member_number = member_row['Member Number']
    
    current_gender = format_field(member_row.get('Gender')) or ""
    current_dob = format_field(member_row.get('Date Of Birth')) or ""
    current_nationality = format_field(member_row.get('Nationality')) or ""
    current_marital = format_field(member_row.get('Marital Status')) or ""
    current_eid = format_field(member_row.get('National Identity')) or ""
    current_visa = format_field(member_row.get('Visa Unified Number')) or ""
    current_passport = format_field(member_row.get('Passport number')) or ""
    
    missing_fields = []
    if not current_gender: missing_fields.append("Gender")
    if not current_dob and not is_principal: missing_fields.append("Date of Birth")
    if not current_nationality: missing_fields.append("Nationality")
    if not current_marital: missing_fields.append("Marital Status")
    if not current_eid: missing_fields.append("Emirates ID")
    if not current_visa: missing_fields.append("Visa Unified Number")
    if not current_passport: missing_fields.append("Passport")
    
    has_missing_fields = len(missing_fields) > 0
    
    direct_inputs = {}
    change_requests = []
    
    if has_missing_fields:
        st.markdown('<p class="section-label" style="margin-top: 20px;">➕ Add Missing Information</p>', unsafe_allow_html=True)
        st.caption("Fill in missing data below. This will be saved directly.")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            if not current_gender:
                new_gender = st.selectbox("Gender", ["", "MALE", "FEMALE"], index=0, key="direct_gender")
                if new_gender:
                    direct_inputs["Gender"] = new_gender
            
            if not current_nationality:
                new_nationality = st.text_input("Nationality", value="", placeholder="Enter nationality", key="direct_nationality")
                if new_nationality:
                    direct_inputs["Nationality"] = new_nationality
        
        with col2:
            if not current_dob and not is_principal:
                new_dob = st.text_input("Date of Birth", value="", placeholder="DD/MM/YYYY", key="direct_dob")
                if new_dob:
                    direct_inputs["Date Of Birth"] = new_dob
            
            if not current_marital:
                new_marital = st.selectbox("Marital Status", ["", "SINGLE", "MARRIED", "DIVORCED", "WIDOWED"], index=0, key="direct_marital")
                if new_marital:
                    direct_inputs["Marital Status"] = new_marital
        
        with col3:
            if not current_eid:
                new_eid = st.text_input("Emirates ID", value="", placeholder="Enter Emirates ID", key="direct_eid")
                if new_eid:
                    direct_inputs["National Identity"] = new_eid
            
            if not current_visa:
                new_visa = st.text_input("Visa Unified No.", value="", placeholder="Enter Visa Number", key="direct_visa")
                if new_visa:
                    direct_inputs["Visa Unified Number"] = new_visa
        
        with col4:
            if not current_passport:
                new_passport = st.text_input("Passport Number", value="", placeholder="Enter Passport", key="direct_passport")
                if new_passport:
                    direct_inputs["Passport number"] = new_passport
        
        if direct_inputs:
            if st.button("💾 Save Missing Information", type="primary", key="save_direct"):
                df = load_data()
                for field, value in direct_inputs.items():
                    df.loc[df['Member Number'] == member_number, field] = value
                df.loc[df['Staff Number'] == staff_number, 'LastEditedByStaffNo'] = staff_number
                df.loc[df['Staff Number'] == staff_number, 'LastEditedOn'] = datetime.now().strftime("%d/%m/%Y %I:%M %p")
                save_data(df)
                st.cache_data.clear()
                st.success("✅ Information saved successfully!")
                st.rerun()
    
    has_existing_data = current_gender or current_dob or current_nationality or current_marital or current_eid or current_visa or current_passport
    
    if has_existing_data or not is_principal:
        st.markdown('<p class="section-label" style="margin-top: 25px;">📝 Request Changes to Existing Data</p>', unsafe_allow_html=True)
        st.caption("Changes to existing information require HR approval.")
        
        if not is_principal:
            current_name = format_field(member_row.get('Member Full Name')) or f"{format_field(member_row.get('Member First Name')) or ''} {format_field(member_row.get('Member Middle Name')) or ''} {format_field(member_row.get('Member Last Name')) or ''}".strip()
            current_name = ' '.join(current_name.split())
            current_relation = format_field(member_row.get('Relation')) or ""
            
            col1, col2 = st.columns(2)
            with col1:
                new_name = st.text_input("Name Change", value="", placeholder=f"Current: {current_name}", key="req_name")
                if new_name and new_name != current_name:
                    change_requests.append({"field": "Name", "old": current_name, "new": new_name, "column": "Member Full Name"})
                
                new_relation = st.selectbox("Relationship Change", ["", "SPOUSE", "CHILD"], index=0, key="req_relation")
                if new_relation and new_relation != current_relation:
                    change_requests.append({"field": "Relationship", "old": current_relation, "new": new_relation, "column": "Relation"})
            
            with col2:
                if current_dob:
                    new_dob_change = st.text_input("Date of Birth Change", value="", placeholder=f"Current: {current_dob}", key="req_dob")
                    if new_dob_change and new_dob_change != current_dob:
                        change_requests.append({"field": "Date of Birth", "old": current_dob, "new": new_dob_change, "column": "Date Of Birth"})
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            if current_gender:
                gender_options = ["", "MALE", "FEMALE"]
                new_gender_change = st.selectbox("Change Gender", gender_options, index=0, key="req_gender")
                if new_gender_change and new_gender_change != current_gender:
                    change_requests.append({"field": "Gender", "old": current_gender, "new": new_gender_change, "column": "Gender"})
            if current_nationality:
                new_nationality_change = st.text_input("Change Nationality", value="", placeholder=f"Current: {current_nationality}", key="req_nationality")
                if new_nationality_change and new_nationality_change != current_nationality:
                    change_requests.append({"field": "Nationality", "old": current_nationality, "new": new_nationality_change, "column": "Nationality"})
        with col2:
            if current_marital:
                marital_options = ["", "SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]
                new_marital_change = st.selectbox("Change Marital Status", marital_options, index=0, key="req_marital")
                if new_marital_change and new_marital_change != current_marital:
                    change_requests.append({"field": "Marital Status", "old": current_marital, "new": new_marital_change, "column": "Marital Status"})
        with col3:
            if current_eid:
                new_eid_change = st.text_input("Change Emirates ID", value="", placeholder=f"Current: {format_emirates_id(current_eid)}", key="req_eid")
                if new_eid_change and new_eid_change != current_eid:
                    change_requests.append({"field": "Emirates ID", "old": current_eid, "new": new_eid_change, "column": "National Identity"})
            if current_visa:
                new_visa_change = st.text_input("Change Visa No.", value="", placeholder=f"Current: {current_visa}", key="req_visa")
                if new_visa_change and new_visa_change != current_visa:
                    change_requests.append({"field": "Visa Unified Number", "old": current_visa, "new": new_visa_change, "column": "Visa Unified Number"})
        with col4:
            if current_passport:
                new_passport_change = st.text_input("Change Passport", value="", placeholder=f"Current: {current_passport}", key="req_passport")
                if new_passport_change and new_passport_change != current_passport:
                    change_requests.append({"field": "Passport Number", "old": current_passport, "new": new_passport_change, "column": "Passport number"})
    
    if change_requests:
        st.markdown('<p class="section-label" style="margin-top: 20px;">Pending Changes (Require Approval)</p>', unsafe_allow_html=True)
        st.markdown('<div class="change-log">', unsafe_allow_html=True)
        for change in change_requests:
            st.markdown(f"""
            <div class="change-item">
                <strong>{change['field']}:</strong>
                <span class="old-value">{change['old']}</span> → 
                <span class="new-value">{change['new']}</span>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        remarks = st.text_area(
            "Reason for changes (Required)",
            placeholder="e.g., 'Emirates ID was renewed' or 'Spelling correction'",
            key="change_remarks",
            label_visibility="collapsed"
        )
        
        submit_disabled = not remarks.strip()
        
        if st.button("📤 Submit Change Request", type="secondary", disabled=submit_disabled):
            change_request = {
                "staff_number": staff_number,
                "member_number": member_number,
                "member_name": selected_member,
                "changes": [{"field": c["field"], "old": c["old"], "new": c["new"]} for c in change_requests],
                "remarks": remarks,
                "submitted_at": datetime.now().isoformat(),
                "status": "pending_approval"
            }
            
            save_change_request(change_request)
            
            df = load_data()
            df.loc[df['Staff Number'] == staff_number, 'LastEditedByStaffNo'] = staff_number
            df.loc[df['Staff Number'] == staff_number, 'LastEditedOn'] = datetime.now().strftime("%d/%m/%Y %I:%M %p")
            save_data(df)
            st.cache_data.clear()
            
            st.session_state['submission_success'] = True
            st.session_state['submission_type'] = 'change_request'
            st.rerun()
        
        if submit_disabled:
            st.caption("⚠️ Please provide a reason for the changes")

def render_dashboard():
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
    st.markdown(SESSION_TIMEOUT_JS, unsafe_allow_html=True)
    
    staff_number = st.session_state.get('staff_number', '')
    df = load_data()
    employee_data = get_employee_data(df, staff_number)
    
    if employee_data.empty:
        st.error("No data found for your account.")
        return
    
    principal = employee_data[employee_data['Relation'] == 'PRINCIPAL'].iloc[0]
    principal_name = principal['Principal Name']
    
    render_header(principal_name, staff_number)
    render_status_strip()
    
    col1, col2, col3 = st.columns([1, 2.5, 1])
    with col2:
        signout_col1, signout_col2 = st.columns([5, 1])
        with signout_col2:
            st.markdown('<div class="signout-btn">', unsafe_allow_html=True)
            if st.button("Sign Out", use_container_width=True):
                st.session_state.clear()
                st.rerun()
            st.markdown('</div>', unsafe_allow_html=True)
        
        render_employee_snapshot(principal, staff_number)
        render_covered_members(employee_data)
        render_confirmation_section(employee_data, staff_number)
        
        st.markdown("""
        <div style="text-align: center; margin-top: 30px; padding: 16px; color: #999; font-size: 11px;">
            Need help? <a href="https://wa.me/971564966546" target="_blank" style="color: #25D366; text-decoration: none;">WhatsApp HR Support</a>
        </div>
        """, unsafe_allow_html=True)

def main():
    if 'authenticated' not in st.session_state:
        st.session_state['authenticated'] = False
    
    if check_link_expired():
        render_expired_page()
        return
    
    if st.session_state['authenticated']:
        render_dashboard()
    else:
        render_login()

if __name__ == "__main__":
    main()
