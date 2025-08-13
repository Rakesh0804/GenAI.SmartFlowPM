namespace GenAI.SmartFlowPM.Domain.Common.Constants;

/// <summary>
/// Constants for task types and their acronyms
/// </summary>
public static class TaskTypeConstants
{
    /// <summary>
    /// Available task type acronyms
    /// </summary>
    public static class Acronyms
    {
        public const string Bug = "BUG";
        public const string Task = "TASK";
        public const string Spike = "SPIKE";
        public const string Story = "STORY";
    }

    /// <summary>
    /// Task type display labels
    /// </summary>
    public static class Labels
    {
        public const string Bug = "Bug";
        public const string Task = "Task";
        public const string Spike = "Spike";
        public const string Story = "User Story";
    }

    /// <summary>
    /// Task type descriptions
    /// </summary>
    public static class Descriptions
    {
        public const string Bug = "Bug fix or defect resolution";
        public const string Task = "General development task";
        public const string Spike = "Research or investigation task";
        public const string Story = "Feature development story";
    }

    /// <summary>
    /// All valid task type acronyms
    /// </summary>
    public static readonly string[] ValidAcronyms = 
    {
        Acronyms.Bug,
        Acronyms.Task,
        Acronyms.Spike,
        Acronyms.Story
    };

    /// <summary>
    /// Default task type acronym
    /// </summary>
    public const string DefaultAcronym = Acronyms.Task;

    /// <summary>
    /// Check if the given acronym is valid
    /// </summary>
    /// <param name="acronym">The acronym to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    public static bool IsValidAcronym(string acronym)
    {
        return !string.IsNullOrWhiteSpace(acronym) && 
               ValidAcronyms.Contains(acronym.ToUpperInvariant());
    }

    /// <summary>
    /// Get the display label for a given acronym
    /// </summary>
    /// <param name="acronym">The acronym</param>
    /// <returns>The display label or the acronym if not found</returns>
    public static string GetLabel(string acronym)
    {
        return acronym?.ToUpperInvariant() switch
        {
            Acronyms.Bug => Labels.Bug,
            Acronyms.Task => Labels.Task,
            Acronyms.Spike => Labels.Spike,
            Acronyms.Story => Labels.Story,
            _ => acronym ?? string.Empty
        };
    }

    /// <summary>
    /// Get the description for a given acronym
    /// </summary>
    /// <param name="acronym">The acronym</param>
    /// <returns>The description or empty string if not found</returns>
    public static string GetDescription(string acronym)
    {
        return acronym?.ToUpperInvariant() switch
        {
            Acronyms.Bug => Descriptions.Bug,
            Acronyms.Task => Descriptions.Task,
            Acronyms.Spike => Descriptions.Spike,
            Acronyms.Story => Descriptions.Story,
            _ => string.Empty
        };
    }
}
