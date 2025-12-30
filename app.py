#!/usr/bin/env python3
"""
HR Portal - React Application
This Streamlit wrapper launches the React/Express backend and displays it via iframe.
"""
import streamlit as st
import subprocess
import threading
import time
import os

st.set_page_config(
    page_title="HR Portal | Baynunah",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def start_express_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    subprocess.run(["npx", "tsx", "server/index.ts"], check=False)

if 'server_started' not in st.session_state:
    st.session_state.server_started = False

if not st.session_state.server_started:
    thread = threading.Thread(target=start_express_server, daemon=True)
    thread.start()
    st.session_state.server_started = True
    time.sleep(3)

st.markdown("""
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stDeployButton {display: none;}
    .block-container {padding: 0 !important; max-width: 100% !important;}
    iframe {border: none !important;}
</style>
""", unsafe_allow_html=True)

st.components.v1.iframe("http://localhost:5001", height=800, scrolling=True)
