import { DynamicMaterialDesignIcon } from '@/app/components/dynamic-material-design-icon';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/__generated__/components/button';
import { useTranslation } from 'react-i18next';

export function ErrorDisplay({
    icon,
    iconInRed = false,
    linkToHome = false,
    message,
    showRefreshButton = false,
}: {
    icon: string;
    iconInRed?: boolean;
    linkToHome?: boolean;
    message: string;
    showRefreshButton?: boolean;
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div
            className={`pt-4 pl-4 ${linkToHome ? 'cursor-pointer' : ''}`}
            onClick={() => {
                if (linkToHome) {
                    navigate('/home');
                }
            }}
        >
            <h1 className="m- flex items-center text-lg font-bold leading-none text-gray-900 md:text-xl lg:text-2xl dark:text-white">
                <DynamicMaterialDesignIcon
                    iconKey={icon}
                    className={`h-16 w-16 bg-white rounded-xl p-1 ${iconInRed ? 'text-red-500' : 'text-gray-500'}`}
                />
                <span className="ml-4">{message}</span>
                {showRefreshButton ? (
                    <Button variant={'outline'} className="ml-4" onClick={() => window.location.reload()}>
                        {t('refresh_page')}
                    </Button>
                ) : (
                    ''
                )}
            </h1>
        </div>
    );
}
