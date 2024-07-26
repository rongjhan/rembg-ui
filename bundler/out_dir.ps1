function Get_outdir {
    $out_dir = $env:OUT_DIR
    if ($out_dir -eq $null) {
        $out_dir = Read-Host -Prompt "not found OUT_DIR in env, please Enter output folder"
    }
    return $out_dir
}