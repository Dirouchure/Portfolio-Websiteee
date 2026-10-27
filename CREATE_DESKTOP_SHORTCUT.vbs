Set WshShell = WScript.CreateObject("WScript.Shell")
Set oShellLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\🚀 Diro Portfolio.lnk")
oShellLink.TargetPath = WshShell.CurrentDirectory & "\AUTO_START_PORTFOLIO.bat"
oShellLink.WorkingDirectory = WshShell.CurrentDirectory
oShellLink.Description = "Diro Uchure - Full Stack Web Developer Portfolio"
oShellLink.Save

MsgBox "✅ Desktop shortcut created!" & vbCrLf & vbCrLf & "Look for: 🚀 Diro Portfolio" & vbCrLf & "on your desktop!", vbInformation, "Shortcut Created"
