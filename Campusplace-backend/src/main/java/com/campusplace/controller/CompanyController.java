package com.campusplace.controller;

import com.campusplace.entity.Company;
import com.campusplace.entity.CompanyCriteria;
import com.campusplace.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // PUBLIC - Anyone can view
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {

        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // 🔐 ADMIN ONLY
    @PostMapping
    public Company addCompany(@RequestBody Company company) {
        return companyRepository.save(company);
    }

    // 🔐 ADMIN ONLY
    @DeleteMapping("/{id}")
    public void deleteCompany(@PathVariable Long id) {
        companyRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Company updateCompany(
            @PathVariable Long id,
            @RequestBody Company updated) {

        Company existing = companyRepository.findById(id)
                .orElseThrow();

        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setIndustry(updated.getIndustry());
        existing.setSalaryPackage(updated.getSalaryPackage());
        existing.setRoles(updated.getRoles());

        // 🔥 HANDLE CRITERIA SAFELY
        if (updated.getCriteria() != null) {

            if (existing.getCriteria() == null) {
                CompanyCriteria criteria = new CompanyCriteria();
                criteria.setCompany(existing);
                existing.setCriteria(criteria);
            }

            existing.getCriteria().setMinCgpa(updated.getCriteria().getMinCgpa());
            existing.getCriteria().setNoActiveBacklogs(updated.getCriteria().isNoActiveBacklogs());
            existing.getCriteria().setAllowedBranches(updated.getCriteria().getAllowedBranches());
        }

        return companyRepository.save(existing);
    }
}