namespace GenAI.SmartFlowPM.Application.Common.Constants;

/// <summary>
/// Contains regex patterns used for validation across the application
/// </summary>
public static class ValidationPatterns
{
    #region User Patterns
    
    /// <summary>
    /// Username pattern: Letters, numbers, hyphens, and underscores only
    /// </summary>
    public const string USERNAME = @"^[a-zA-Z0-9_-]+$";
    
    /// <summary>
    /// Username or Email pattern: Allows either username format or email format
    /// This pattern accepts traditional usernames (letters, numbers, hyphens, underscores) or valid email addresses
    /// </summary>
    public const string USERNAME_OR_EMAIL = @"^([a-zA-Z0-9_-]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$";
    
    /// <summary>
    /// Strong password pattern: At least one lowercase, one uppercase, one digit
    /// </summary>
    public const string STRONG_PASSWORD = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$";
    
    /// <summary>
    /// Name pattern: Letters, spaces, hyphens, and apostrophes only
    /// </summary>
    public const string NAME = @"^[a-zA-Z\s'-]+$";
    
    #endregion
    
    #region Contact Patterns
    
    /// <summary>
    /// Email pattern: Standard email validation
    /// Uses built-in EmailAddress attribute for validation, but this can be used for custom scenarios
    /// </summary>
    public const string EMAIL = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
    
    /// <summary>
    /// Phone number pattern: International format with optional + prefix
    /// Supports formats like: +1234567890, 1234567890, +12 345 678 9012
    /// </summary>
    public const string PHONE_NUMBER = @"^\+?[1-9]\d{1,14}$";
    
    /// <summary>
    /// Phone number with spaces pattern: Allows spaces and hyphens
    /// Supports formats like: +1 234 567 8901, +1-234-567-8901, 234-567-8901
    /// </summary>
    public const string PHONE_NUMBER_WITH_SPACES = @"^\+?[1-9][\d\s-]{7,17}$";
    
    /// <summary>
    /// Country code pattern: 1-4 digit country codes
    /// </summary>
    public const string COUNTRY_CODE = @"^\+?[1-9]\d{0,3}$";
    
    #endregion
    
    #region Business Patterns
    
    /// <summary>
    /// Project name pattern: Letters, numbers, spaces, hyphens, underscores, and dots
    /// </summary>
    public const string PROJECT_NAME = @"^[a-zA-Z0-9\s._-]+$";
    
    /// <summary>
    /// Task title pattern: Letters, numbers, spaces, and common punctuation
    /// </summary>
    public const string TASK_TITLE = @"^[a-zA-Z0-9\s.,!?'""-]+$";
    
    /// <summary>
    /// Organization name pattern: Letters, numbers, spaces, and common business punctuation
    /// </summary>
    public const string ORGANIZATION_NAME = @"^[a-zA-Z0-9\s.,&()-]+$";
    
    /// <summary>
    /// Team name pattern: Letters, numbers, spaces, hyphens, and underscores
    /// </summary>
    public const string TEAM_NAME = @"^[a-zA-Z0-9\s_-]+$";
    
    #endregion
    
    #region URL and Code Patterns
    
    /// <summary>
    /// URL pattern: Basic URL validation
    /// </summary>
    public const string URL = @"^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$";
    
    /// <summary>
    /// Alphanumeric code pattern: Letters and numbers only
    /// </summary>
    public const string ALPHANUMERIC_CODE = @"^[a-zA-Z0-9]+$";
    
    /// <summary>
    /// UUID/GUID pattern: Standard UUID format
    /// </summary>
    public const string UUID = @"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
    
    #endregion
    
    #region Financial Patterns
    
    /// <summary>
    /// Currency amount pattern: Decimal numbers with optional currency symbols
    /// Supports: 123.45, $123.45, €123.45, £123.45
    /// </summary>
    public const string CURRENCY_AMOUNT = @"^[€£$]?\d+(\.\d{1,2})?$";
    
    /// <summary>
    /// Percentage pattern: Numbers with % symbol
    /// </summary>
    public const string PERCENTAGE = @"^(100|[1-9]?\d)(\.\d{1,2})?%?$";
    
    #endregion
    
    #region Date and Time Patterns
    
    /// <summary>
    /// Date pattern: YYYY-MM-DD format
    /// </summary>
    public const string DATE_YYYY_MM_DD = @"^\d{4}-\d{2}-\d{2}$";
    
    /// <summary>
    /// Time pattern: HH:MM format (24-hour)
    /// </summary>
    public const string TIME_24_HOUR = @"^([01]?[0-9]|2[0-3]):[0-5][0-9]$";
    
    /// <summary>
    /// Time pattern: HH:MM AM/PM format (12-hour)
    /// </summary>
    public const string TIME_12_HOUR = @"^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM|am|pm)$";
    
    #endregion
    
    #region File and Path Patterns
    
    /// <summary>
    /// File name pattern: Valid file name characters
    /// </summary>
    public const string FILE_NAME = @"^[a-zA-Z0-9\s._-]+\.[a-zA-Z0-9]{1,10}$";
    
    /// <summary>
    /// Folder name pattern: Valid folder name characters
    /// </summary>
    public const string FOLDER_NAME = @"^[a-zA-Z0-9\s._-]+$";
    
    #endregion
    
    #region Version and Code Patterns
    
    /// <summary>
    /// Semantic version pattern: Major.Minor.Patch format
    /// </summary>
    public const string SEMANTIC_VERSION = @"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$";
    
    /// <summary>
    /// Hex color pattern: #FFFFFF or #FFF format
    /// </summary>
    public const string HEX_COLOR = @"^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$";
    
    #endregion
}

/// <summary>
/// Contains validation error messages for common patterns
/// </summary>
public static class ValidationMessages
{
    #region User Messages
    
    public const string USERNAME_INVALID = "Username can only contain letters, numbers, hyphens, and underscores";
    public const string USERNAME_OR_EMAIL_INVALID = "Username must be either a valid username (letters, numbers, hyphens, underscores) or a valid email address";
    public const string PASSWORD_WEAK = "Password must contain at least one lowercase letter, one uppercase letter, and one number";
    public const string NAME_INVALID = "Name can only contain letters, spaces, hyphens, and apostrophes";
    
    #endregion
    
    #region Contact Messages
    
    public const string EMAIL_INVALID = "Email format is invalid";
    public const string PHONE_NUMBER_INVALID = "Phone number format is invalid";
    public const string COUNTRY_CODE_INVALID = "Country code format is invalid";
    
    #endregion
    
    #region Business Messages
    
    public const string PROJECT_NAME_INVALID = "Project name contains invalid characters";
    public const string TASK_TITLE_INVALID = "Task title contains invalid characters";
    public const string ORGANIZATION_NAME_INVALID = "Organization name contains invalid characters";
    public const string TEAM_NAME_INVALID = "Team name contains invalid characters";
    
    #endregion
    
    #region URL and Code Messages
    
    public const string URL_INVALID = "URL format is invalid";
    public const string ALPHANUMERIC_CODE_INVALID = "Code can only contain letters and numbers";
    public const string UUID_INVALID = "Invalid UUID format";
    
    #endregion
    
    #region Financial Messages
    
    public const string CURRENCY_AMOUNT_INVALID = "Invalid currency amount format";
    public const string PERCENTAGE_INVALID = "Invalid percentage format";
    
    #endregion
    
    #region Date and Time Messages
    
    public const string DATE_INVALID = "Date format must be YYYY-MM-DD";
    public const string TIME_INVALID = "Invalid time format";
    
    #endregion
    
    #region File Messages
    
    public const string FILE_NAME_INVALID = "File name contains invalid characters";
    public const string FOLDER_NAME_INVALID = "Folder name contains invalid characters";
    
    #endregion
    
    #region Version Messages
    
    public const string SEMANTIC_VERSION_INVALID = "Invalid semantic version format";
    public const string HEX_COLOR_INVALID = "Invalid hex color format";
    
    #endregion
}
