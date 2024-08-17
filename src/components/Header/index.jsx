import React from 'react';
import BackButton from '../BackButton/index';

const Header = ({ onNavigate }) => (
  <div className="header">
    <BackButton onNavigate={onNavigate} />
    <svg width="46" height="21" viewBox="0 0 46 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <svg width="46" height="21" viewBox="0 0 46 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.349" cy="9.06656" r="7.40469" fill="#D5016C"/>
        <circle cx="12.4224" cy="9.1399" r="6.01173" fill="#D5016C"/>
        <circle cx="12.4223" cy="9.13984" r="4.69208" fill="#90268E"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.84649 0.278564C3.72132 1.27343 2.80313 2.48018 2.14433 3.8299C1.48553 5.17963 1.09903 6.64589 1.00689 8.14499C0.914757 9.64408 1.11879 11.1466 1.60735 12.5669C2.09591 13.9871 2.85942 15.2972 3.85429 16.4224C4.84916 17.5476 6.0559 18.4658 7.40563 19.1246C8.75535 19.7834 10.2216 20.1699 11.7207 20.262C13.2198 20.3541 14.7224 20.1501 16.1426 19.6615C17.4578 19.2091 18.6785 18.5209 19.7454 17.6316L18.462 16.3483C17.5942 17.047 16.6108 17.5905 15.5551 17.9537C14.3591 18.3651 13.0939 18.5369 11.8315 18.4593C10.5691 18.3817 9.33441 18.0563 8.19783 17.5015C7.06125 16.9467 6.04507 16.1735 5.2073 15.2261C4.36954 14.2786 3.7266 13.1754 3.31519 11.9794C2.90378 10.7834 2.73197 9.51814 2.80955 8.25578C2.88714 6.99341 3.2126 5.75869 3.76737 4.62211C4.32214 3.48553 5.09533 2.46935 6.04282 1.63158L4.84649 0.278564Z" fill="#231F20"/>
        <path d="M24.8517 12.7138V9.90514H25.789V14.7039H24.8704V13.8728H24.8205C24.7101 14.129 24.533 14.3425 24.2894 14.5133C24.0477 14.682 23.7468 14.7663 23.3865 14.7663C23.0782 14.7663 22.8054 14.6987 22.5679 14.5633C22.3326 14.4258 22.1472 14.2227 22.0118 13.9541C21.8785 13.6854 21.8119 13.3532 21.8119 12.9574V9.90514H22.746V12.845C22.746 13.172 22.8366 13.4323 23.0178 13.626C23.199 13.8197 23.4344 13.9166 23.7239 13.9166C23.8988 13.9166 24.0727 13.8728 24.2456 13.7854C24.4206 13.6979 24.5653 13.5656 24.6799 13.3886C24.7965 13.2115 24.8538 12.9866 24.8517 12.7138ZM27.0441 14.7039V9.90514H27.9782V14.7039H27.0441ZM27.5158 9.16471C27.3534 9.16471 27.2138 9.11056 27.0972 9.00225C26.9826 8.89187 26.9254 8.76065 26.9254 8.60861C26.9254 8.45448 26.9826 8.32327 27.0972 8.21496C27.2138 8.10458 27.3534 8.04938 27.5158 8.04938C27.6783 8.04938 27.8168 8.10458 27.9313 8.21496C28.048 8.32327 28.1063 8.45448 28.1063 8.60861C28.1063 8.76065 28.048 8.89187 27.9313 9.00225C27.8168 9.11056 27.6783 9.16471 27.5158 9.16471ZM29.1349 14.7039V14.0634L31.7342 10.7612V10.7174H29.2193V9.90514H32.8996V10.5862L30.4002 13.8478V13.8916H32.987V14.7039H29.1349ZM33.9891 14.7039V14.0634L36.5884 10.7612V10.7174H34.0735V9.90514H37.7537V10.5862L35.2544 13.8478V13.8916H37.8412V14.7039H33.9891ZM39.8774 8.30556V14.7039H38.9433V8.30556H39.8774ZM43.2023 14.8007C42.7295 14.8007 42.3223 14.6997 41.9807 14.4977C41.6412 14.2936 41.3788 14.0072 41.1934 13.6385C41.0102 13.2678 40.9185 12.8335 40.9185 12.3357C40.9185 11.8442 41.0102 11.411 41.1934 11.0361C41.3788 10.6612 41.6371 10.3686 41.9682 10.1582C42.3015 9.94783 42.691 9.84265 43.1367 9.84265C43.4074 9.84265 43.6699 9.88743 43.924 9.97699C44.1781 10.0666 44.4061 10.2071 44.6081 10.3988C44.8102 10.5904 44.9695 10.8393 45.0861 11.1454C45.2028 11.4495 45.2611 11.8192 45.2611 12.2545V12.5857H41.4465V11.8859H44.3457C44.3457 11.6401 44.2957 11.4224 44.1958 11.2329C44.0958 11.0413 43.9552 10.8903 43.774 10.7799C43.5949 10.6695 43.3845 10.6143 43.1429 10.6143C42.8805 10.6143 42.6514 10.6789 42.4556 10.808C42.2619 10.9351 42.1119 11.1017 42.0057 11.3079C41.9016 11.512 41.8495 11.7338 41.8495 11.9733V12.5201C41.8495 12.8408 41.9057 13.1137 42.0182 13.3386C42.1328 13.5635 42.2921 13.7354 42.4962 13.8541C42.7003 13.9707 42.9388 14.029 43.2116 14.029C43.3887 14.029 43.5501 14.004 43.6959 13.9541C43.8417 13.902 43.9677 13.8249 44.0739 13.7229C44.1801 13.6208 44.2614 13.4948 44.3176 13.3448L45.2017 13.5042C45.1309 13.7645 45.0039 13.9926 44.8206 14.1884C44.6394 14.3821 44.4113 14.5331 44.1364 14.6414C43.8636 14.7476 43.5522 14.8007 43.2023 14.8007Z" fill="black"/>
        <path d="M19.0317 15.738L21.953 18.5358" stroke="#D5016C" stroke-width="1.75953"/>
    </svg>
    </svg>
  </div>
);

export default Header;